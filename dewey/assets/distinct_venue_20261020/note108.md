# The adjusted venue-count association depends on the comparison object

20 October 2026. Completed empirical descriptive sensitivity, with independent
code and aggregate-disclosure review. This extends an existing measure to
matched adjusted samples; it is not a new index, preregistration, causal
estimate or upstream replication. STATUS.md remains canonical.

## Main result

The earlier positive association between venue count and racial separation
does **not** carry over to the conditional difference between two distinct
venues after additive area and subcategory controls. In 2019, on the all-
eligible sample, the partial correlation with log venue count is 0.124670
for the original absolute between-venue component, but 0.002518 for the
distinct-venue contrast. The original separation share has correlation
0.140757. The same qualification holds in 2017 and 2018 and in the stable-ID
sample: all six area/category-adjusted distinct-venue correlations lie
between -0.001651 and 0.002518.

Without area controls, distinct-venue correlations remain positive
(0.397818 to 0.428344 across the six sample-years). Thus the result is not
"no composition differences anywhere." It is a much narrower finding:
the earlier count gradient is sensitive to whether same-venue pairs are
included and whether geographic average differences are removed.

These are descriptive point estimates, not equivalence tests or evidence
that venue availability has no causal effect. No standard errors, p-values
or significance claims were estimated in this bounded diagnostic.

## What the two objects measure

Each cell is one recorded area, subcategory and year. Let \(p_j\) be a venue's
four-group visitor-origin racial-composition vector and \(w_j\) its normalized
inherited annualized matched-visit weight. These are home-area demographic
proxies, not observed visitors' individual race or simultaneous encounters.

The original component is

\[
B=\tfrac12\sum_{j,k}w_jw_k\lVert p_j-p_k\rVert^2.
\]

It draws two venues independently, proportional to their weights. Sometimes
the two draws select the same venue, which contributes zero difference.
Writing \(H=\sum_jw_j^2\), the probability of different recorded venues is
\(1-H\). The existing distinct-venue contrast is

\[
D=\frac{B}{1-H}.
\]

It asks: conditional on drawing **different** venues, how different are their
composition vectors? It does not mean drawing the first venue and then
renormalizing the remaining venues for the second draw. It is also not a
correction for noisy composition estimates or an assumption that annualized
visits are independent customers.

The accounting identity is \(B=(1-H)D\). A cell can have a larger original
between-venue component because visits are less concentrated, because
different venues have more different composition, or both. The changed
correlation does not identify a causal contribution from either factor.

\(D\) lies between zero and one but can exceed the pooled fractionalization
\(P\). It is not a share of total diversity. The earlier separation share
is \(S=B/P\), and within-venue diversity is
\(W=\sum_jw_j(1-\sum_g p_{jg}^2)\). Unlike \(B\), \(D\) changes if a recorded
venue is split into identical copies. It is a different estimand, not an
automatically superior replacement for the original.

## Exact specification and sample

For each year separately, report

\[
\operatorname{Corr}\{M_X\log(N),\,M_X Y\},
\qquad Y\in\{S,B,W,D\}.
\]

\(M_X\) removes either subcategory fixed effects alone or additive recorded-
area and subcategory fixed effects. This is not an area-by-subcategory
interaction specification. Cells receive equal regression weight; visit
weights operate within cells when constructing the outcomes. The years are
not pooled, so there are no pooled-year fixed effects.

The input is the approved, hash-pinned continuity summary used in note 89,
not a fresh pass through raw POI or flow files. Retain the same 150 matched
subcategories and the original rules: at least two eligible venues, pooled
racial diversity at least 0.05, and at least 20 eligible areas per
subcategory. The stable sample requires the inherited valid venue ID,
category and area continuity; it is not independent proof of business
continuity. All 933 recorded areas are retained as labelled areas, not
claimed to be 933 verified metropolitan areas.

## Complete results

All entries are partial correlations with log nominal venue count, rounded
to six decimals. They are not percentage changes in diversity. The first
three outcome columns reproduce previously released estimates; the last
column contains the 12 new estimates.

| Year | Sample | Controls | Separation S | Between B | Within W | Distinct D |
|---|---|---|---:|---:|---:|---:|
| 2017 | All | Category | 0.559368 | 0.547308 | 0.288865 | 0.400225 |
| 2017 | All | Area + category | 0.137254 | 0.119511 | -0.010222 | -0.000054 |
| 2018 | All | Category | 0.563781 | 0.558842 | 0.301187 | 0.411219 |
| 2018 | All | Area + category | 0.139894 | 0.124787 | -0.004672 | 0.002248 |
| 2019 | All | Category | 0.567627 | 0.563471 | 0.304730 | 0.413695 |
| 2019 | All | Area + category | 0.140757 | 0.124670 | -0.010357 | 0.002518 |
| 2017 | Stable IDs | Category | 0.557490 | 0.546079 | 0.291454 | 0.397818 |
| 2017 | Stable IDs | Area + category | 0.138032 | 0.119023 | -0.013207 | -0.001651 |
| 2018 | Stable IDs | Category | 0.566060 | 0.559671 | 0.304705 | 0.413961 |
| 2018 | Stable IDs | Area + category | 0.138307 | 0.121968 | -0.007503 | -0.000331 |
| 2019 | Stable IDs | Category | 0.578532 | 0.571312 | 0.312426 | 0.428344 |
| 2019 | Stable IDs | Area + category | 0.142409 | 0.126141 | -0.004480 | 0.000925 |

The two control specifications use identical support within each sample-year.
Each row below covers 933 recorded areas and 150 subcategories.

| Year | Sample | Area-subcategory cells | Included POI-years |
|---|---|---:|---:|
| 2017 | All | 75,320 | 2,675,114 |
| 2018 | All | 77,182 | 2,880,329 |
| 2019 | All | 82,032 | 3,247,365 |
| 2017 | Stable IDs | 71,033 | 2,374,836 |
| 2018 | Stable IDs | 71,054 | 2,374,990 |
| 2019 | Stable IDs | 71,134 | 2,375,384 |

![Same samples and controls, with a common full correlation scale](../output/distinct_venue_adjusted_20261020/released/distinct_venue_comparison.png)

[Full-precision table](../output/distinct_venue_adjusted_20261020/released/all_models.csv)
and [reviewed model summary](../output/distinct_venue_adjusted_20261020/released/model_summary.json).

## Consequence for the paper

**Narrow the count-based claim.** More recorded venues are associated with
the original separation component, but the evidence does not establish
that the composition of different venues becomes more dissimilar after
the fixed geographic/category adjustments. This qualification belongs
alongside the original finding, not in a hidden robustness appendix.
Do not select the original measure merely because its association is larger,
or replace it with D merely because the result is near zero.

The broader-category sensitivity in note 106 remains a separate completed
result: removing workforce-match selection did not remove the original
count gradient. That exercise did not estimate D on the broader category
sample. This new exercise retains the original 150 categories; it must not
be presented as that unrun broader-sample D test.

Continue the measurement-led descriptive contribution. Do not promote this
nominal-count correlation as evidence of sorting preferences or an urban-
variety mechanism. The distinct income/common-menu question still requires
its authorized inputs, source geography and choice-set checks. The January
2026 demographic-preferences paper uses much more specific trip, product
and home-location restrictions; our annual cell correlations do not
reproduce its identification strategy.
[Couture, Dingel, Green and Handbury, January 2026 working paper](https://www.jdingel.com/research/CoutureDingelGreenHandbury.pdf).

## Verification and remaining limits

The real summary-based calculation took 10.731 seconds. All 36 old
correlations reproduce within \(2.23\times10^{-16}\); an independent sparse
projection agrees on the full family within \(7.55\times10^{-15}\). The 38
artificial-data tests pass, including an independent dense fixed-effect
calculation. Three release-boundary defects identified during review were
fixed before export and are retained in the review record.

Independent disclosure review cleared only the complete 12-model,
48-correlation national whitelist and named safe metadata for the exact
candidate fingerprint. A separate replay regenerated the released CSV and
PNG byte-for-byte using only the public summary. This is not a rerun of
Tommy's or Diego's upstream pipeline and does not establish its correctness.

Missing/suppressed origins, uncertain source geography, venue definitions,
measurement error and the earlier failed inference gates remain. The frozen
protocol, construction record, independent review and verification receipts
are linked below. No original data or historical result was overwritten.

- [Protocol](../docs/protocols/distinct_venue_adjusted_comparison_20261020.md)
- [Construction record](../docs/data_construction/108_distinct_venue_adjusted_comparison.md)
- [Independent review](../workstreams/distinct_venue_adjusted_review_20261020.md)
- [Exact disclosure receipt](../output/distinct_venue_adjusted_20261020/review_receipt.json)
- [Public-summary replay receipt](../output/distinct_venue_adjusted_20261020/released/verification_receipt.json)
