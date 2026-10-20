# Distinct-venue comparison on identical adjusted samples

20 October 2026. Bounded, post-result descriptive sensitivity. The earlier
count gradients and distinct-venue count-bin means are already known.
This is neither a preregistration nor a new primary specification.

## Question and incremental value

The earlier analysis reports a distinct-venue composition contrast in broad
count bands. It does not report that contrast with the same area/category
adjustment as the original count-separation correlations. This exercise
fills that specific comparison, without repeating the means, replacing the
original measure or claiming a new index.

For normalized within-cell venue weights \(w_j\), shares \(p_j\), and
\(H=\sum_j w_j^2\), the existing between-venue component is
\(B=\frac12\sum_{j,k}w_jw_k\|p_j-p_k\|^2\). Its distinct-venue counterpart is
\(D=B/(1-H)\). This is half the expected squared composition difference
between two independent weight-proportional venue draws, conditional on
their being different venues. It is not sequential probability-proportional
sampling without replacement. It lies in [0,1], but can exceed pooled
fractionalization, so it is not a share of total segregation.

Unlike B, D changes when one venue record is split into identical copies.
Venue identity remains substantive. Removing same-venue pair mass does not
correct composition-estimation noise, suppressed origins, repeated devices,
spatial confounding or endogenous venue availability. No iid customer
sample-size interpretation of annualized visits is permitted.

## Frozen comparison

Reuse only the already authorized, immutable private continuity-cell
summary used in construction log 92. Its pinned hash and public baseline
are constants in `service_comparison_stability.py`. No original final file,
weekly flow, ACS lookup, employee workbook or historic input is reopened.
Permission is the 19 October explicit bounded final-file/private-summary
venue-count authorization; the separate annual-flow/ACS approval stays pending.

Retain the original 150 matched subcategories, all-valid and stable-venue
samples, all three years, and original cell eligibility: at least two venues,
pooled racial diversity at least .05, at least 20 eligible area cells per
subcategory. Stable is the inherited same valid ID, category and area
sample, not independently established business continuity.

For each sample-year, compute partial correlations with log nominal venue
count for four outcomes: separation B/P, absolute B, within diversity W and
distinct-venue D. Use exactly two specifications: subcategory fixed effects,
and additive area plus subcategory fixed effects. All cells have equal
regression weight; inherited visit weights define within-cell composition.
No pooled-year regression, volume/pooled-diversity controls, new threshold,
sample trimming, hypothesis test, standard error or model selection is added.
The complete family is 12 model records and 48 correlations, of which
12 D correlations are newly estimated.

## Fail-closed validation and release

Verify the private-summary hash before and after reading; verify the frozen
baseline hash and all six national summaries using the existing validator.
Require complete keys, valid moments, exact group/year/sample coverage,
positive pair-exclusion probability and D within numerical tolerance of
[0,1]. Do not silently omit problematic cells, clip values, or replace
undefined correlations. A numerical failure stops the family.

Reproduce every selected prior model's support and all 36 original
correlations within 1e-8. Independently compare all 48 correlations using
the sparse dummy-variable projection, also within 1e-8. Require each
released model to cover at least 20 areas, 100 cells and 1,000 POI-years.
Before production, test the weighted pair identity directly on artificial
venue vectors, non-invariance to splitting, zero/degenerate inputs,
eligibility and failed support, and comparison to explicit dummy regression.

Keep detailed inputs, validation diagnostics and the full candidate private.
Read the gate before any candidate. Independent disclosure review must
consider cumulative earlier counts/means/correlations and clear the exact
candidate hash and a whitelist, not a directory. Proposed release:
12 records with sample, year, specification, exposure label, support totals
and four correlations; one maximum baseline error, one maximum sparse
error, runtime, safe code/protocol/baseline hashes and software versions.
No H values, new outcome means, category labels, residual variances,
covariances, coefficients, detailed cells or origin/venue rows.

## Interpretation and decision

Report the full family with the same graphical scale and no significance
stars. A persistent D association means the observed adjusted association
is not solely the probability of drawing the same recorded venue under
this weighting scheme. It does not rule out other finite-sample or
geographic explanations and is not an identified mechanism.
Attenuation or reversal narrows the count claim rather than motivating a
new preferred specification. There is no automatic statistical cutoff for
promotion. Retain the original B/P, B and W evidence and all failed gates.
The correct next substantive income/common-menu step still requires its
own approved inputs and geographic/choice-set validation.
