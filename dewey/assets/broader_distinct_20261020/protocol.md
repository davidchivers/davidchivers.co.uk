# Broader-category distinct-venue comparison

20 October 2026. Locked before inspecting broader-category D results, after
notes 106 and 108 are known. This is a post-result sensitivity, not a new
primary specification or preregistration. Earlier protocols remain unchanged.

## Question

Does note 108's near-zero area/category-adjusted association between recorded
venue count and conditional distinct-venue composition contrast also hold
when the workforce-bridge category restriction is removed?

Note 106 broadened the category sample for S, B and W but did not compute D.
Its private cell files lack the squared-weight sum needed for D; do not
impute it from venue count or treat equal venue weights as equivalent.

## Authorized inputs and construction

Use only the three explicitly approved final
`poi_indices_harmonized_2017.parquet`, `2018` and `2019` files, with their
existing frozen hashes and approved private configuration. Reuse the frozen
150-category bridge without modifying it or opening employee workbooks.
No original weekly flow, annual-flow, new ACS or other dataset is approved.

Reuse note 106's exact common-valid flag construction, named-subcategory rule,
recorded-area normalization and within-cell weights. Recompute its mapped and
all-named-category cell moments and add `sum(w*w)` in the same valid population.
Require exact key coverage and numerical agreement on count and total weight.
For each cell let H=sum(w*w)/sum(w)^2, effective count=1/H, and D=B/(1-H).
Check finite moments, 1 <= effective count <= recorded count and the inherited
pair-contrast domain. No undefined D cell may be silently dropped.

The historical final-file permission of 19 October covers this venue-count
check. Original files are read-only, detailed cells stay outside Git/AI context,
and no broadening of the separate pending income-pilot approval is implied.

## Complete fixed family

For each of 2017, 2018 and 2019, estimate the same two specifications:
category controls and additive recorded-area/category controls. Separately
run the original mapped categories and all eligible named categories.
This gives 12 model records, not a pooled-year regression.

For each record retain partial correlations of log recorded venue count with:

1. S = between/pooled racial fractionalization.
2. B = absolute between-venue racial diversity.
3. W = weighted average within-venue racial diversity.
4. D = composition contrast conditional on independent weighted venue draws
   selecting different recorded venues.

The model weights cells equally; venue composition uses the inherited annualized
matched-visit weights within cells. The same four origin-race groups, common
race/income validity, minimum two venues, pooled diversity >=0.05 and minimum
20 eligible areas per category apply. The expanded sample is not the stable-ID
sample. No additional outcome, control, threshold, year, subgroup, p-value,
standard error or causal estimate will be searched.

## Checks and release

Require all 36 note-106 correlations and corresponding support totals to
reproduce within 1e-8, and all 24 mapped-category note-108 correlations
(including its six D values, original all-eligible sample) to reproduce within
1e-8. Recheck the added-category support screen in every year. Verify all
48 correlations using the independent sparse dummy-variable projection.
All original source hashes and execution-code/protocol/baseline hashes must
match before/after. A failure withholds the whole new family.

Preserve all source cells, provenance details, exceptions and preliminary
candidate results privately. A separate reviewer checks the code on synthetic
data first, then only the exact aggregate candidate/gate for disclosure and
cumulative-release risks. Release only the reviewed national model family,
support totals, reconciliation maxima, source/code hashes, runtime and
environment. No detailed cells, labels, weight moments, residuals or
reconstructable small differences enter the public output.

## Decision

Report the entire fixed family regardless of sign. If the adjusted D result
remains small, narrow the nominal-count mechanism interpretation further.
If it changes in the broader sample, report sample selection as a material
qualification, without selecting favourable categories. Neither outcome
identifies a causal availability effect, preferences, simultaneous encounters
or the absence of a meaningful population effect. Correlation magnitudes
without uncertainty are not an equivalence test.
