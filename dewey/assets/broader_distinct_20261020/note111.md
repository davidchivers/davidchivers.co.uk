# Broader category coverage does not restore a large distinct-venue count gradient

20 October 2026. Completed descriptive sample-selection sensitivity, with
independent code and exact-aggregate disclosure review. This follows notes
106 and 108; it is not a new primary specification, preregistration, causal
estimate or upstream replication.

## Main finding

The earlier qualification is not confined to the original 150 categories.
Removing the workforce-bridge match restriction expands the eligible
subcategory sample to 269 in 2017, 267 in 2018 and 282 in 2019. After
additive area and category controls, the partial correlations between log
venue count and the conditional distinct-venue contrast are 0.006422,
0.008313 and 0.008975. They are small positive point estimates, not estimates
of exactly zero.

In the broader 2019 sample, the original absolute between-venue component
has correlation **0.168015**, compared with **0.008975** for the contrast
conditional on selecting different venues. The separation share remains
positively associated with count, at 0.178317. Without area controls, the
distinct-venue correlation is 0.369671. Thus geography and the comparison
object materially affect the descriptive finding.

In plain language: places with more recorded venues still look more
separated under the original measure. But, after the same geographic and
service adjustments, there is little linear association between venue
count and how different two distinct venues' clientele compositions are.
This does not establish that venues are alike, that mixing is unimportant,
or that adding venues would have no effect.

## Data and measures

The local calculation uses the three previously authorized annual final
POI files for 2017-2019, constructed from Advan mobility data supplied through
Dewey and inherited home-area demographic assignments. The originals are
read-only. It does not reconstruct original weekly flows or certify their
upstream construction.

Each analytical cell is a recorded area, POI subcategory and year. Let
\(p_j\) denote a venue's four-group visitor-origin racial-composition vector,
and let \(w_j\) be its inherited annualized matched-visit weight normalized
to sum to one within the cell. Home-area shares are proxies, not observed
individual race or simultaneous encounters.

Writing \(\bar p=\sum_j w_jp_j\), the measures are

\[
P=1-\sum_g\bar p_g^2,\qquad
W=\sum_jw_j\left(1-\sum_g p_{jg}^2\right),\qquad
B=P-W,\qquad S=B/P.
\]

\(W\) is average within-venue racial fractionalization; \(B\) is the absolute
between-venue component; \(S\) is its share of pooled diversity. Define

\[
H=\sum_jw_j^2,\qquad
D=\frac{B}{1-H}
 =\frac{\tfrac12\sum_{j,k}w_jw_k\lVert p_j-p_k\rVert^2}{1-H}.
\]

\(D\) measures the composition contrast conditional on two independent
weighted venue draws selecting different recorded venues. The identity
\(B=(1-H)D\) separates the chance of selecting different venues from their
conditional contrast. It does not identify causal mechanism shares.
Conditioning both independent draws on being different is not the same
as drawing the first venue and then renormalizing the second draw.

\(D\) is not a share of pooled diversity and can exceed \(P\). It is not a
sampling-noise correction. It also changes if one recorded venue is split
into identical copies, so its near-zero association does not make it an
automatically superior measure. Both objects and all results are retained.

## Exact comparison

For each year and sample separately, the reported statistic is

\[
\operatorname{Corr}\!\left(M_X\log N,\,M_XY\right),
\qquad Y\in\{S,B,W,D\},
\]

where \(N\) is eligible recorded venue count and \(M_X\) removes either
subcategory fixed effects or additive recorded-area and subcategory fixed
effects. The latter is not an area-by-subcategory interaction. These are
equal-cell partial correlations, not outcome-unit slopes. Visit weights
operate inside each cell's measures. Years are not pooled.

The mapped sample retains the frozen 150-category workforce bridge. The
broader sample removes only that match requirement and keeps all named
categories meeting the inherited rules. Both retain the same common
race/income validity masks, positive valid weights and geography, at least
two venues per cell, pooled racial diversity of at least 0.05, and at least
20 eligible areas per category. Thus the broader sample is not all provider
POIs, nor a sample free of missing-income selection. Neither sample here is
the stable-ID sample. The 933 recorded areas are not asserted to be 933
verified metropolitan areas.

This specification was frozen after the earlier S/B/W and mapped-D results
were known, but before the broader D estimates were inspected. No additional
outcomes, controls, subgroup searches, uncertainty estimates or causal
regressions were added.

## Complete results

All values are partial correlations with log recorded venue count, rounded
to six decimals. The S/B/W columns reproduce note 106. The mapped D entries
reproduce note 108's all-eligible sample. **Only the six broader D estimates
are new empirical correlation values.** Counts and models are retained in
full, rather than selecting the largest or smallest association.

| Year | Sample | Controls | Separation S | Between B | Within W | Distinct D |
|---|---|---|---:|---:|---:|---:|
| 2017 | Mapped | Category | 0.559368 | 0.547308 | 0.288865 | 0.400225 |
| 2017 | Mapped | Area + category | 0.137254 | 0.119511 | -0.010222 | -0.000054 |
| 2017 | Broader | Category | 0.537360 | 0.522972 | 0.285001 | 0.357944 |
| 2017 | Broader | Area + category | 0.170634 | 0.158982 | -0.004153 | 0.006422 |
| 2018 | Mapped | Category | 0.563781 | 0.558842 | 0.301187 | 0.411219 |
| 2018 | Mapped | Area + category | 0.139894 | 0.124787 | -0.004672 | 0.002248 |
| 2018 | Broader | Category | 0.541550 | 0.534132 | 0.296859 | 0.367145 |
| 2018 | Broader | Area + category | 0.173324 | 0.164406 | 0.002278 | 0.008313 |
| 2019 | Mapped | Category | 0.567627 | 0.563471 | 0.304730 | 0.413695 |
| 2019 | Mapped | Area + category | 0.140757 | 0.124670 | -0.010357 | 0.002518 |
| 2019 | Broader | Category | 0.543693 | 0.536624 | 0.299586 | 0.369671 |
| 2019 | Broader | Area + category | 0.178317 | 0.168015 | -0.003717 | 0.008975 |

The two control specifications use identical support within each sample-year.
There are no confidence intervals, significance stars or equivalence tests.
The new broader estimates are somewhat larger than their mapped counterparts;
the conclusion is a small descriptive gradient, not identical estimates.

| Year | Sample | Categories | Areas | Cells | POI-years |
|---|---|---:|---:|---:|---:|
| 2017 | Mapped | 150 | 933 | 75,320 | 2,675,114 |
| 2017 | Broader | 269 | 933 | 82,364 | 2,708,843 |
| 2018 | Mapped | 150 | 933 | 77,182 | 2,880,329 |
| 2018 | Broader | 267 | 933 | 84,500 | 2,916,032 |
| 2019 | Mapped | 150 | 933 | 82,032 | 3,247,365 |
| 2019 | Broader | 282 | 933 | 91,098 | 3,291,988 |

![Mapped and broader samples on a common correlation scale](../output/broader_distinct_venue_20261020/released/broader_distinct_venue.png)

[Full-precision table](../output/broader_distinct_venue_20261020/released/all_models.csv)
and [complete reviewed summary](../output/broader_distinct_venue_20261020/released/model_summary.json).

## Implication for the paper

**Retain the measurement-led descriptive question; narrow the count-based
mechanism claim.** Broadening the categories does not restore a large
area/category-adjusted D correlation. The positive original count pattern
alone cannot establish that more options create increasingly different
clienteles. Neither this result nor the accounting identity proves that
visit concentration explains the original association causally.

The next substantive step is not to search for categories or controls that
restore a preferred sign. Questions about common accessible destinations,
product differences or origin-specific choices need their separately
authorized inputs and opportunity-set checks. This sensitivity does not
clear those gates or establish a publishable standalone count paper.

This completes the previously unrun broader-category D comparison mentioned
in [note 108's published report](https://davidchivers.github.io/davidchivers.co.uk/dewey/distinct-venue-comparison.html).
It leaves the original result and stable-ID comparison intact. The broader
sample's stable-ID version has not been estimated.

## Verification and limitations

The local production pass took 486.956 seconds, approximately 8.1 minutes.
Note 106's saved cells did not contain squared weights, so obtaining \(H\)
required one new approved read-only pass over the existing annual final
files. All original hashes, sizes and modification times matched afterward.
No new raw source was acquired or original overwritten.

The 36 note-106 correlations reproduce within \(2.23\times10^{-16}\).
The 24 mapped note-108 comparisons, which overlap that family, reproduce
within \(1.39\times10^{-16}\). An independent sparse fixed-effect projection
agrees on all 48 values within \(2.26\times10^{-14}\). Independent review
also checked the national support and cumulative disclosure risks before
clearing only the precise release whitelist. The released CSV and graph
replay byte-for-byte without opening private data.

All 28 focused tests pass. Two pre-production guard defects were corrected:
integer count reconciliation now requires exact equality, and candidate
digests must be valid SHA-256 strings rather than merely equal objects.
Those synthetic/software checks are not independent upstream data replication.

Uncertain geography vintage, missing/suppressed origins, inherited
annualization, observation error, provider coverage and the earlier failed
inference gates remain. Four-group area composition does not reveal an
individual's race, personal income, conversation or attitude. No estimate
here concerns workers' observed interactions, an attitude effect or historical
Green Book persistence.

- [Frozen sensitivity protocol](../docs/protocols/broader_distinct_venue_20261020.md)
- [Exact independent review receipt](../output/broader_distinct_venue_20261020/review_receipt.json)
- [Public-summary replay receipt](../output/broader_distinct_venue_20261020/release_verification.json)
