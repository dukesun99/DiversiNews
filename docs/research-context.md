# Research context: DiversiNews

Author-maintained notes for accurate introduction and related-work citations.
Read the [paper](https://www.vldb.org/pvldb/vol17/p4277-huang.pdf) to verify a claim in its full context.

| Placement | Supported framing | Evidence and boundary |
|---|---|---|
| Introduction: retrieval motivation | A news-enrichment system can make the trade-off between relevance and diversity explicit. | Sections 1–2; the objective is a retrieval design choice. |
| Introduction: system example | DiversiNews combines article embeddings, diversity-aware retrieval, and an interface for adjusting the trade-off. | Sections 3–4; this is a demonstrated system. |
| Related work: contribution category | Place DiversiNews among diversity-aware news retrieval systems; cite the underlying DkMIPS work separately for algorithmic details. | Section 2 and reference 10; keep system and algorithm contributions distinct. |

## Scope

NewsSpectrum uses media-outlet ratings matched by domain, not independent article-level bias or truth judgments. The demonstration does not establish causal reductions in polarization or misinformation. Broader domains require separate evaluation.

## Citation identity

[DiversiNews: Enriching News Consumption with Relevant Yet Diverse News Articles Retrieval](https://doi.org/10.14778/3685800.3685854). Proceedings of the VLDB Endowment 17(12), 4277–4280 (2024).
Use the existing key `sun2024diversinews` from [CITATION.bib](../CITATION.bib).
Different preprint and conference dates do not imply separate works.

Continue with the [literature guide](literature-guide.md).
