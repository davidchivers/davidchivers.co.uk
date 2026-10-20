# Independent distinct-venue synthetic/code review

20 October 2026. Bounded review in the named worktree. Production and release
changes belong to Main; this reviewer owns only this report and
`code/analysis/test_distinct_venue_adjusted_comparison.py`.

## Final disposition - 20 October 2026

**No remaining findings within the bounded synthetic/code review.**
The unchanged finalized suite passes all 38 tests, including the additional
support-bound case fixed by Main. This clears the requested pre-production
synthetic review for the source identities recorded below. It is not a
production result, authorization to access additional inputs, independent
empirical replication, or disclosure clearance for an actual candidate hash.

## Follow-up finding - 20 October 2026, resolved

**P2: cell totals larger than the area-category key space.** In the
first-fix exporter, lines 59-61 did not enforce `cells <= areas * categories`.
An artificial record with `cells=120`, `areas=20`, `categories=5`,
`poi_years=1000` passed `prepare_release`, although unique annual
area-category keys allow at most 100 cells. The count passed the integer,
minimum-support and other coherence checks and serialized normally.
Reproducer:
`code/analysis/test_distinct_venue_adjusted_comparison.py:679`,
`ReleaseGuardTests.test_support_counts_must_be_jointly_possible`.

Main added the exact bound at
`code/analysis/release_distinct_venue_adjusted.py:61`. The unchanged regression
now passes. This was a release-boundary fail-closed gap under an inconsistent
artificial candidate, not evidence of a duplicate cell or incorrect real
estimate. The comparison path already validated unique input keys.

## Initial findings - 20 October 2026, resolved

1. **Nested release metadata was not whitelisted.** The original exporter
   at lines 60-61 copied `environment` and `code_hashes` wholesale. An
   artificial private sentinel in either mapping escaped into the release.
   Main now checks the exact seven source-path keys and four software keys
   plus scalar formats at current lines 75-84. Both original regression
   subcases pass. Expanded tests also reject missing/replacement keys,
   non-mappings, nested objects, nonstring values and malformed strings.
   No actual private metadata was inspected or shown to have escaped.

2. **Support totals accepted nonfinite or fractional values.** Original
   lines 45-49 checked only lower bounds and did not validate category
   counts. Main added positive nonboolean integer support, integer years
   and coherence checks at current lines 55-67. All 12 original
   malformed numeric subcases pass after the fix. Added boolean, zero,
   negative, string and integer-valued-float count cases pass, as do the
   existing area/cell, category/minimum-area and POI/cell consistency checks.
   The later combinatorial upper-bound finding and fix are recorded above.

Main also added runtime checks at lines 85-87. Nonfinite, negative,
boolean, string and structured runtime values all fail closed.

## Scope and checks

Read the repository/project instructions, data policy, the dated protocol,
the comparison script and its safe imported helper definitions. Also read
the new release script at Main's request. No production or release
entrypoint was invoked. No restricted configuration, restricted file,
raw source or real-data path was opened. No output, site, protocol, STATUS
or other worker file was changed. The optional public baseline file was
not needed or opened. No external model or delegation was used.

All test observations are generated in memory from invented venue vectors.
Regression references use an independently constructed dense dummy matrix
and NumPy least squares, not the production encoding, eligibility or
absorption implementation. The regression fixture uses six artificial
categories and 24 areas, with three years and both samples; a separate
150-category fixture checks the inherited category-universe gate.
Matplotlib is stubbed during an isolated release-module import to avoid
plotting configuration/cache access without poisoning another test's normal
module import. File/data/execution entrypoints are blocked during tests;
`-B` disables bytecode writes.

The initial core checks passed: weighted pair identity, [0,1] bounds up to
declared numerical tolerance without clipping, D exceeding pooled diversity,
intentional splitting non-invariance, absence of composition-noise correction,
sample/year-specific eligibility, exact 12-model/48-correlation coverage,
constant-variable failures, failed support, NaN/invalid cells, corrupted
baseline models/moments, sparse disagreement and independent dense FE checks,
including unbalanced and disconnected designs. Dense reference agreement is
checked within 1e-10, tighter than the protocol's 1e-8 requirement. Exact
candidate-hash matching, literal-True flags, complete release model/outcome
keys, finite numerical errors and top-level/model private-field exclusion
also pass.
An overly strict test-only threshold distinguishing conditional independent
draws from sequential PPS was corrected from .01 to .0001; the artificial
contrast differs by about .00915. This was not a production defect.

## Verification

Command from the project root:

```text
python -B code/analysis/test_distinct_venue_adjusted_comparison.py -v
```

All rounds below were on 20 October 2026:

1. Original exporter: 33 tests, 31 passing test methods and 14 failing
   subcases in two methods, 1.636 s, exit code 1. Exporter SHA-256:
   `65626e3cdf5789865cd9d4e1efada33d4c2011435e4b67d418b6b0c3e3867cd0`.
   This run followed correction of the test-only PPS threshold described
   above.
2. After Main's first fixes: unchanged 33-test suite passed, 1.727 s.
   Exporter SHA-256:
   `45c7f422a1e1c1fce3220dcff33507d82a706e817c69763442ddfb09a4048301`.
3. Added five directly scoped metadata/runtime/support tests: 38 tests,
   37 passing and one failing subcase, 1.749 s, exit code 1. The only failure
   was the combinatorial count bound, on the same first-fix exporter.
4. **Final unchanged-suite rerun after Main's upper-bound fix: 38 tests,
   all passing, 2.152 s, exit code 0.** Exporter SHA-256:
   `f3915730dfff6c64b415ed69dd669a3126760039fd346263fdc8593135827b28`.

All eight safe-source identities below were checked before and after the
final run and matched. No expected-failure marker, skipped test or relaxed
production gate was used. No empirical result was recomputed and this
report is not a disclosure clearance or release approval.

Reviewed SHA-256 identities (safe source files only):

| File | SHA-256 |
| --- | --- |
| `docs/protocols/distinct_venue_adjusted_comparison_20261020.md` | `285d0c825dfeec11fee5788713dfde2cea91544dc742ed1a466e704fd5e4f15c` |
| `code/analysis/distinct_venue_adjusted_comparison.py` | `b3ea9882bbdd6e4f77808455d8676a4a7f52dec319d8d1ce787abbcf091cd969` |
| `code/analysis/release_distinct_venue_adjusted.py` | `f3915730dfff6c64b415ed69dd669a3126760039fd346263fdc8593135827b28` |
| `code/analysis/ranked_measurement_checks.py` | `933cdb43fe48556d55a65f7291fd214af17423947e3e32979c80c43674f9db6f` |
| `code/analysis/service_comparison_stability.py` | `57e3777976f4be1c823f36357fa1fcf75a0cca4ed5f42320b8be70a91abad35f` |
| `code/analysis/run_within_venue_measurement_audit.py` | `fe2a49babe70bd9814c21af1c343992a0f870d17815e1a02a3639c6ce28a3fed` |
| `code/analysis/venue_count_pilot.py` | `836a8bd59e82aa790b9600981baf18043f330defd10a3fbcdf56061d7549f2be` |
| `code/analysis/test_distinct_venue_adjusted_comparison.py` | `3295e78b1929fc937d0d4df7b1c015a23820ff5b909e679f5838f6523d3032cc` |

Runtime: Python 3.12.10, NumPy 2.3.5, pandas 3.0.0, SciPy 1.15.3,
DuckDB 1.5.4. DuckDB was only imported transitively; no connection or
query was executed.

Changed paths, and no others:

- `code/analysis/test_distinct_venue_adjusted_comparison.py`
- `workstreams/distinct_venue_adjusted_review_20261020.md`

## Independent aggregate disclosure review - 20 October 2026

Review time: 10:34 UTC. This is a new, separately authorized aggregate-review
phase, not a revision of the synthetic evidence or a rerun of estimation.
The earlier findings, failures, fixes and no-private-access statements above
describe the preceding synthetic phase and are retained unchanged.

### Authorization and identity

Main reported its finalized 38-test run passing in 1.798 s and production
completing with exit code 0 in approximately 10.730934 s, using the existing
hash-pinned private continuity summary without reopening original POI files.
This reviewer did not run production or independently inspect those sources.

The user then expressly permitted reading the one named private configuration
to resolve the production sibling directory, followed by its gate and the
exact candidate after hash verification. Access in this phase was limited to
that configuration, `gate_report.json`, `private_candidate.json`, the two
named previously reviewed public aggregate files, and safe local
code/protocol identities. No cell Parquet, source dataset, earlier private
report, Dropbox content or original data-side code was opened. No empirical
rerun, candidate copy, chart generation, CSV generation or release occurred.

The four gate flags were independently checked as literal booleans equal to
true before candidate content was read. The gate identity and SHA-256 of
the candidate both matched the user-specified digest:

```text
c8ced95a8881bcdbff43c6d9de143594a6c36d2cfc1ae3256f76529b897fb626
```

The candidate was rehashed after inspection and retained the same identity.
The reviewed exporter still matches the synthetic-cleared SHA-256
`f3915730dfff6c64b415ed69dd669a3126760039fd346263fdc8593135827b28`.
Source-fingerprint assertions for restricted inputs remain production
receipt assertions, not fresh restricted-source hashing by this reviewer.

### Exact whitelist and checks

**Aggregate disclosure review complete; the exact whitelist is approved
for this candidate hash only.** The complete private candidate is not
approved for copying or publication.

Allowed model fields are exactly `year`, `sample`, `specification`,
`exposure`, `cells`, `areas`, `categories`, `poi_years`, `correlations`.
Require the complete 12-record family: both `all` and `stable_venue`,
2017-2019 separately, category and additive area/category specifications,
and `log_count` exposure. The correlation dictionary contains exactly
`sorting`, `between_race`, `within_race`, `distinct_venue`: 48 correlations,
including 12 new distinct-venue correlations.

Allowed extra fields are exactly `max_baseline_error`,
`max_independent_sparse_error`, `elapsed_seconds`, `code_hashes`,
`environment`. The seven source-hash paths and four version keys are
exactly those in the fixed exporter's `SAFE_CODE_PATHS` and `VERSION_KEYS`.
Their scalar types, formats and actual safe-file hash correspondence passed.
The runtime is finite, nonnegative and agrees between gate and candidate.
The two finite nonnegative maximum errors satisfy the 1e-8 gate and agree
with the available aggregate comparisons/private scalar maximum. Only
the maximum errors, not per-model sparse details, are cleared.

All model counts are positive nonboolean integers and satisfy the minimum
20-area, 100-cell, 1,000-POI-year screens and the fixed coherence checks.
Every support total matches the already reviewed continuity model.
All 36 prior correlations reproduce within 1e-8. The six shared
workforce-mapped models also match support and all 18 existing correlations.
No new values were printed during the pre-clearance checks.

Exclude `private_validation`, per-model `independent_sparse_error`,
convergence details, residual standard deviations, residual vectors,
coefficients, covariances, new means, H/effective-count details, additional
bins, category or area identifiers, source-data paths and row/cell records.
An explicit in-memory field projection was checked; no full candidate
was written outside its authorized private location.

### Cumulative and subtraction assessment

The comparison covered both specified reviewed releases:

| Prior public release | SHA-256 |
| --- | --- |
| `output/ranked_research_20261019/continuity_results.json` | `75be4f375832da068d15d852bba3abf4d958290753c9e8e39a89473627ab2b74` |
| `output/workforce_bridge_selection_20261020/released_v2/model_summary.json` | `b69549dc52b30ff3e5d98cc12bda06e66652981666fc4b780729489b716f248a` |

The continuity release already contains national annual moments, selected
model supports and old correlations, residual-exposure standard deviations,
and released count-bin means including D and effective count. These were
considered rather than assuming the earlier release contained correlations
alone. Its released bins pass the stated support screens. The workforce
release contains mapped/broader-category correlations and three added-support
records; those added-support records also pass the screens.

The proposed release adds no new support partition or support totals.
Its 36 old outcome correlations are repeated evidence, not a new set of
outcome moments. The incremental substantive information is the 12 national
adjusted D correlations on the already released samples/specifications.
Neither reviewed source supplies corresponding D residual variances or
D covariance components that would turn these normalized correlations into
additive subset totals. Existing count-bin means and exposure standard
deviations do not supply those missing D residual moments.

Subtracting all/stable or mapped/broader correlations is not a decomposition
of subset moments: residualization, centering and normalization differ
across samples. No new broader-category D correlation is proposed. Within
these two reviewed releases and this exact whitelist, no direct small-subset
subtraction or row/cell reconstruction route was identified. This is a
bounded disclosure assessment, not differential privacy, an exhaustive
external-linkage audit, or a provider-permission determination. Additional
partitions, outcome moments, residual scales or identifiers require review.

### Receipt and limits

Wrote `output/distinct_venue_adjusted_20261020/review_receipt.json` with
literal `independent_review_complete=true`, `release_approved=true`, the
exact candidate identity, both field whitelists, review note and caveats.
No new correlation values are included in this report or receipt.
Structured readback verified both literal approvals, the exact nine/five
field whitelists and the note/caveats. The candidate and fixed exporter
identities were rechecked at receipt verification and still matched.
Receipt SHA-256:
`74f33008e04b91588f22082e94d9fa04a2e7625b409b41997768a71abf799e9c`.

The current description remains post-result and descriptive. D is a
conditional contrast between independent weight-proportional distinct-venue
draws, not a noise correction or fraction of pooled diversity. Preserve
mixed findings and previous failed gates; recorded areas are not verified
MSAs, stable IDs do not prove business continuity, and annual home-area
composition is not individual traits, simultaneous encounters or causality.

Main must rehash at use, require the literal receipt approvals, enforce
the exact whitelist with the fixed exporter, and verify the released
artifacts separately. This reviewer performed no release.

Newly authorized changed paths in this aggregate-review phase:

- `workstreams/distinct_venue_adjusted_review_20261020.md` (append-only addendum)
- `output/distinct_venue_adjusted_20261020/review_receipt.json`
