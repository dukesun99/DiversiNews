# NewsSpectrum

This dataset contains two files, one `articles.json` and one `domains.json`.

The `articles.json` file contains a JSON list of articles, each is a dict with the following fields: `_id`, `title`, `excerpt`, `hostname` and `source-hostname`. 
- `_id`: the unique identifier (URL) of the article
- `title`: the title of the article
- `excerpt`: a short excerpt of the article
- `hostname`: the domain of the article
- `source-hostname`: the media name of the article

Note the text body of the articles is not included in this dataset due to copyright reasons. We use [`trafilatura`](https://trafilatura.readthedocs.io/en/latest/) to crawl the URLs. You can use the `_id` field to fetch the full text of the article and extract the text body using `trafilatura`.

The `domains.json` file contains a JSON dict of domains, where the key is the domain name of the news outlets, and the value is a dict with the following fields: `bias_rating_text`, `bias_rating_num`, `confidence`, `media_name`, `website_url`.
- `bias_rating_text`: the bias rating of the media outlet
- `bias_rating_num`: the bias rating in number (from AllSides, only some media outlets have this field)
- `confidence`: the confidence level of the bias rating 
- `media_name`: the name of the news outlet
- `website_url`: the URL of the outlet's website