import json
import numpy as np
import os
import requests
import json
from http.server import BaseHTTPRequestHandler, HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
import threading
import urllib.parse
from tqdm import tqdm
import random
import matplotlib.pyplot as plt
import base64
import io
import os
dirname = os.path.dirname(__file__)

with open(os.path.join(dirname, '../NewsSpectrum/articles.json'), 'r') as outfile:
    candidates = json.load(outfile)

with open(os.path.join(dirname, '../NewsSpectrum/domains.json'), 'r') as outfile:
    all_domains = json.load(outfile)

encoder_specific_cache = {
}

encoders = {
    "AnglE": "uae",
    "Sentence-BERT": "sbert",
    "LLAMA 2": "llama",
}

for encoder in encoders:
    encoder_specific_cache[encoder] = {}
    
with open(os.path.join(dirname, './queries/50k_uae_balanced_original_indices.json'), 'r') as outfile:
    original_indices = json.load(outfile)

with open(os.path.join(dirname, './queries/50k_uae_balanced_query_embs.users.json'), 'r') as outfile:
    query_indices = json.load(outfile)

def parse_and_structure_data(file_path):
    structured_data = []
    with open(file_path, 'r') as file:
        # Reading all lines
        lines = file.readlines()

        # Finding the start of the data (after the header)
        header_index = 0
        for i, line in enumerate(lines):
            if line.strip() and 'UID' in line:
                header_index = i
                break

        # Extracting header
        header = lines[header_index].strip().split(',')

        # Parsing each data line into a dictionary
        for line in lines[header_index + 1:]:
            if line.strip():  # Skipping empty lines
                row_data = line.strip().split(',')

                # Creating a dictionary for each row
                data_dict = {}
                ids, ips = [], []
                for key, value in zip(header, row_data):
                    if key.startswith('ID'):
                        ids.append(int(value))
                    elif key.startswith('IP'):
                        ips.append(float(value))
                    else:
                        # Converting to float or int where applicable
                        try:
                            data_dict[key] = int(value)
                        except ValueError:
                            try:
                                data_dict[key] = float(value)
                            except ValueError:
                                data_dict[key] = value

                # Adding ID and IP lists to the dictionary
                data_dict['IDs'] = ids
                data_dict['IPs'] = ips

                # Appending the structured dictionary to the list
                structured_data.append(data_dict)

    return structured_data

for encoder in encoders:
    result_files_folder = os.path.join(dirname, './results/' + "{}_50k/".format(encoders[encoder]))

    # Creating a list of all result files
    result_files = [file for file in os.listdir(result_files_folder) if file.endswith('.csv')]

    # Creating a list of all structured data
    structured_data = {file: parse_and_structure_data(os.path.join(result_files_folder, file)) for file in result_files}

    encoder_specific_cache[encoder]['structured_data'] = structured_data
    encoder_specific_cache[encoder]['result_files'] = result_files

text_to_num = {
            "Left": -2,
            "Lean Left": -1,
            "Center": 0,
            "Lean Right": 1,
            "Right": 2,
            "Mixed": 0,
        }
            
class ThreadingSimpleServer(ThreadingMixIn, HTTPServer):
    pass

def format_returned_item(idx, sim_score):
    item = {
        "title": candidates[idx]["title"],
        "url": candidates[idx]["_id"],
        "excerpt": candidates[idx]["excerpt"],
        "sim_score": sim_score,
        "domain": candidates[idx]["hostname"],
        "publisher": candidates[idx]["source-hostname"],
        "media_name": all_domains[candidates[idx]["hostname"]]["media_name"],
        "media_url": all_domains[candidates[idx]["hostname"]]["website_url"],
        "bias": text_to_num[all_domains[candidates[idx]["hostname"]]["bias_rating_text"]],
        "idx": idx
    }
    return item

def count_biases(search_results):
    bias_num = [0, 0, 0, 0, 0]
    for item in search_results:
        # use text_to_num to convert bias text to number
        bias_num[item["bias"] + 2] += 1
    return bias_num

def calc_pairwise_bias_distance(search_results):
    sum_bias_distance = 0
    for i in range(len(search_results)):
        for j in range(i + 1, len(search_results)):
            sum_bias_distance += abs(search_results[i]["bias"] - search_results[j]["bias"])
    return sum_bias_distance / (len(search_results) * (len(search_results) - 1) / 2)

def get_file_name(method, lam):
    best_cs = {
        "BC-Greedy": "bc_avg_c=0.15_10",
        "BC-DualGreedy": "bc_dual_avg_c=0.15_10",
        "Linear": "linear_avg_c=0.15_10" 
    }
    return best_cs[method] + "_" + str(lam) + ".csv"



def get_encoded_image_of_stacked_horizontal_bar(data, bar_height=1):
    """
    Generate an enhanced stacked horizontal bar chart and return it as a base64 encoded string.
    Suitable for JSON serialization and sending to the frontend.
    """
    # Labels for the categories and a refined color palette
    categories = ['Left', 'Lean Left', 'Center', 'Lean Right', 'Right']
    colors = ['#1f78b4', '#a6cee3', '#b2df8a', '#fb9a99', '#e31a1c']

    # Initialize a variable to store the cumulative width
    cumulative_width = 0

    # Create the plot
    fig, ax = plt.subplots(figsize=(10, bar_height))
    
    # Plot each bar and add the label directly beneath the bar
    for value, category, color in zip(data, categories, colors):
        if value > 0:  # Only plot and label non-zero values
            ax.barh(['Articles'], value, height=bar_height, left=cumulative_width, color=color)
            label_position = cumulative_width + value / 2  # Position for the label is the center of the bar
            ax.text(label_position, -bar_height * 0.8, category, ha='center', va='bottom', color='black', fontweight='bold', fontsize=10)
            cumulative_width += value

    # Remove axes and spines
    ax.axis('off')
    ax.set_xlim(0, cumulative_width)  # Set x-axis limits to fit all labels

    # Save the plot to a buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches = 'tight', pad_inches = 0)
    plt.close(fig)

    # Encode the image to base64
    encoded_image = base64.b64encode(buffer.getvalue()).decode('utf-8')

    return encoded_image


def handle_search_article(js):
    query_idx = js["idx"]
    lam = js["lambda"]
    method = js["method"]
    encoder = js["encoder"]

    global structured_data
    global result_files

    if lam == 1:
        method = "Linear"
        lam = 0.5

    structured_data = encoder_specific_cache[encoder]['structured_data']
    result_files = encoder_specific_cache[encoder]['result_files']

    result_file = get_file_name(method, lam)
    structured_result = structured_data[result_file]

    result_obj = None
    result_query_idx = None
    for i in range(len(structured_result)):
        obj = structured_result[i]
        if query_indices[obj["UID"]] == query_idx:
            result_obj = obj
            result_query_idx = obj["UID"]
            break
    if result_obj is None:
        print("Cannot find query item")
        return None
    
    search_results = []
    for i in range(10):
        idx = original_indices[result_obj["IDs"][i]]
        sim_score = result_obj["IPs"][i]
        search_results.append(format_returned_item(idx, sim_score))
    num_bias = count_biases(search_results)
    # Generate the encoded image
    encoded_image = get_encoded_image_of_stacked_horizontal_bar(num_bias, bar_height=0.5)
    encoded_image = 'data:image/png;base64,{}'.format(encoded_image)
    pairwise_bias_diff = calc_pairwise_bias_distance(search_results)
    final = {
        "query_item": format_returned_item(query_idx, -10),
        "search_results": search_results,
        "encoded_image": encoded_image,
        "pairwise_bias_diff": pairwise_bias_diff
    }
    return final

def is_good_example(query_idx, method):
    avg_diffs = []
    for lam in [0.1, 0.3, 0.5, 0.7, 0.9, 1]:
        if lam == 1:
            method = "Linear"
            lam = 0.5

        result_file = get_file_name(method, lam)
        structured_result = structured_data[result_file]

        result_obj = None
        result_query_idx = None
        for i in range(len(structured_result)):
            obj = structured_result[i]
            if query_indices[obj["UID"]] == query_idx:
                result_obj = obj
                result_query_idx = obj["UID"]
                break
        if result_obj is None:
            print("Cannot find query item")
            return None
        query_bias = text_to_num[all_domains[candidates[query_idx]["hostname"]]["bias_rating_text"]]
        sum_diff = 0
        count = 0
        for i in range(10):
            idx_i = original_indices[result_obj["IDs"][i]]
            res_bias_i = text_to_num[all_domains[candidates[idx_i]["hostname"]]["bias_rating_text"]]
            for j in range(i + 1, 10):
                idx_j = original_indices[result_obj["IDs"][j]]
                res_bias_j = text_to_num[all_domains[candidates[idx_j]["hostname"]]["bias_rating_text"]]
                sum_diff += abs(res_bias_i - res_bias_j)
                count += 1
        avg_diffs.append(sum_diff / count)
    is_good = True
    for i in range(5):
        if avg_diffs[i] < (avg_diffs[i + 1] - 0.0):
            is_good = False
            break
    # return is_good, [format(diff, ".2f") for diff in avg_diffs]
    return is_good, avg_diffs

def handle_sample_queries(js):
    result_file = get_file_name("Linear", 0.5)
    structured_result = structured_data[result_file]

    result_uids = []
    for obj in structured_result:
        if query_indices[obj["UID"]] in result_uids:
            continue
        result_uids.append(query_indices[obj["UID"]])

    search_results = []
    all_avg_diffs = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    for i in range(len(result_uids)):
        idx = result_uids[i]
        item = format_returned_item(idx, -10)
        item["is_good"], item["avg_diffs"] = is_good_example(idx, "BC-Greedy")
        for j in range(6):
            all_avg_diffs[j] += item["avg_diffs"][j]
        search_results.append(item)
    for j in range(6):
        all_avg_diffs[j] /= len(result_uids)

    final = {
        "search_results": search_results
    }
    return final

class handler(SimpleHTTPRequestHandler):
    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.send_header('charset','utf-8')
        self.end_headers()
        encodedStr = self.rfile.read(int(self.headers['Content-Length'])).decode("utf-8")
        text = urllib.parse.unquote(encodedStr)
        js = json.loads(text)
        if js["mode"] == "showresults":
            final = handle_search_article(js)
            print("showresults", js)
            
        elif js["mode"] == "samplequeries":
            final = handle_sample_queries(js)
            print("samplequeries", js)

        self.wfile.write(bytes(json.dumps(final), "utf8"))
        return
              

with ThreadingSimpleServer(('0.0.0.0', 10232), handler) as server:
    print("Server ready")
    server.serve_forever()