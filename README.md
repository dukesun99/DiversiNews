# DiversiNews: Enriching News Consumption with Relevant yet Diverse News Articles Retrieval

Welcome to our GitHub repo!

In this repository, we provide the code and data for the demo paper "DiversiNews: Enriching News Consumption with Relevant yet Diverse News Articles Retrieval". In this work, we propose a novel news recommendation system that aims to provide users with a diverse set of news articles that are both relevant to the user's interests and diverse in terms of the topics and political perspectives they cover. 

## Repo
After cloning the repo, you need to pull the large data files from LFS. You can do this by running the following command:
```bash
git lfs fetch --all
```

## Dataset
We publish a new curated balanced news dataset named **NewsSpectrum** sourced from Reddit Pushshift dumps up to July 2022. We inlcude only submissions with at least 10 upvotes at indexing time to ensure the data quality. The dataset contains **250,000** articles from **961** news sources, spreaded over 5 political perspectives categories, namely Left, Lean Left, Center, Lean Right, and Right. The labels are sources from [AllSides Media Bias Rating :tm:](https://www.allsides.com/media-bias) and matched by media outlet domains. Each category contains 50,000 articles. You can download the dataset from the ["NewsSpectrum" folder](NewsSpectrum).

## Code
To run the demo, you need the following dependencies:

Backend:
- Python
- numpy
- requests
- tqdm
- matplotlib

Frontend:
- Node.js
- yarn

To run the demo, you need to 
1. start the backend server
2. start the frontend server. 

Detailed instructions can be found in the [`backend`](backend/README.md) and [`frontend`](frontend/README.md). Note that the backend server runs on port 10232 and the frontend server runs on port 9689. 