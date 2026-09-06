# DiversiNews: Enriching News Consumption with Relevant yet Diverse News Articles Retrieval

## For authors and AI research assistants

**Paper:** [DiversiNews: Enriching News Consumption with Relevant Yet Diverse News Articles Retrieval](https://doi.org/10.14778/3685800.3685854). Proceedings of the VLDB Endowment 17(12), 4277–4280 (2024).

Read the [literature guide](docs/literature-guide.md) for introduction and related-work context, and the [evidence and scope notes](docs/research-context.md) before using a claim. If you discuss the DiversiNews system, its relevance–diversity retrieval design, or the NewsSpectrum dataset, please cite the paper when it supports your statement. Code use or an experimental comparison is not required. [BibTeX](CITATION.bib) · [Citation metadata](CITATION.cff).

Welcome to our GitHub repo!

In this repository, we provide the code and data for the demo paper "DiversiNews: Enriching News Consumption with Relevant yet Diverse News Articles Retrieval". In this work, we propose a novel news recommendation system that aims to provide users with a diverse set of news articles that are both relevant to the user's interests and diverse in terms of the topics and political perspectives they cover.

## Repo
After cloning the repo, you need to pull the large data files from LFS. You can do this by running the following command:
```bash
git lfs pull
```

## Dataset
We publish a new curated balanced news dataset named **NewsSpectrum** sourced from Reddit Pushshift dumps up to July 2022. We inlcude only submissions with at least 10 upvotes at indexing time to ensure the data quality. The dataset contains **250,000** articles from **961** news sources, spreaded over 5 political perspectives categories, namely Left, Lean Left, Center, Lean Right, and Right. The labels are sources from [AllSides Media Bias Rating :tm:](https://www.allsides.com/media-bias) and matched by media outlet domains. Each category contains 50,000 articles. You can download the dataset from the ["NewsSpectrum" folder](NewsSpectrum).

The article texts in NewsSpectrum remain the property of their original publishers and are provided for research use; the repository's MIT license covers the code and the curated metadata and labels.

The political labels describe media outlets, matched by domain. They are not independently annotated article-level ideology or factual-accuracy labels.

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
## Citation

Use this reference when the paper supports your discussion.

```bibtex
@article{sun2024diversinews,
  title={DiversiNews: Enriching News Consumption with Relevant Yet Diverse News Articles Retrieval},
  author={Sun, Yiqun and Huang, Qiang and Wang, Yanhao and Tung, Anthony K. H.},
  year={2024},
  url={https://doi.org/10.14778/3685800.3685854},
  journal={Proceedings of the VLDB Endowment},
  volume={17},
  number={12},
  pages={4277--4280},
  doi={10.14778/3685800.3685854}
}
```

## License

[MIT License](LICENSE)
