# What the supplied production code establishes

20 October 2026. Read-only source review, not a rerun of the original
2017-2019 pipeline. This supplements the earlier Eren-code assessment
([note 105](105_hamilton_static_code_assessment.md)).

## Bottom line

The supplied folder materially improves the replication record. It contains
a `poi_new_measures` pipeline that explains how the annual origin-flow
files and additional measures were constructed. Its configuration defaults
to 2017 and permits panel-year and ACS-year environment overrides.
Twenty-six source files were privately snapshotted and verified byte for
byte against their originals; fifteen Python files parse successfully.
No supplied pipeline was imported, executed or changed.

However, these current copies are not yet independently tied to the exact
2017, 2018 and 2019 production jobs. The older code families still have 2024
settings, and the new-measures folder does not contain a launcher establishing
the year-specific environment used. The coauthor's statement identifying the
versions is useful provenance, but it is distinct from executed-source hashes,
launch settings and run-linked input/output manifests.

## Important findings

| Issue | What the source actually does | Implication |
|---|---|---|
| Income missingness | Excludes missing origin income from the weighted numerator and denominator and renormalizes observed support | This is not zero-income imputation. The older `fraction_cbgs_with_income` counts CBGs, however; it is not the later flow-weighted coverage measure. |
| Annual origin flows | Sums eligible POI-CBG counts across contributing chunks and writes one origin-count dictionary per venue | These are recorded origin-flow weights, not distinct annual visitors or annualized raw visit counts. |
| Weeks and partitions | Counts contributing files/chunks for eligibility; no distinct-calendar-week key or cross-file venue/date/CBG deduplication is established | Multiple partitions or overlapping inputs could affect eligibility and weights. Actual incidence and impact remain unmeasured; legitimate partitions must not simply be deleted. |
| Missing racial support | A zero represented race vector can produce fractionalization of one rather than missing | This is a code-level edge-case error, not evidence that the delivered harmonized files contain it. A four-group fractionalization index cannot validly exceed 0.75. |
| Output assembly | Collects matching state files and annual-flow interims without a run-completeness or stale-file identity gate | Partial or mixed-attempt assembly is possible, not established. Exact run folders and state-completion evidence are needed. |
| Distance and timing extensions | Some shares normalize coordinate-matched flow; missing support may be zero-filled. Timing lacks an explicit calendar-year clipping rule | These additional variables need support and calendar checks before substantive use. They are not part of the newly approved income-accounting result. |

The new annual-flow producer is traceable from chunk construction, through
state aggregation, to final concatenation. The nineteen older files that
can be compared with Eren's previously extracted copies match after newline
normalization. That is same-text evidence, not an original-byte comparison
to Eren or proof of historical execution.

The claim that the new code leaves the core wholly unchanged also needs
qualification: the empty-decile guard differs. The review identifies the
change without asserting that it affected a production run.

## Raw-file integrity is unresolved

David has supplied the PRS Downloads location and reported corruption, but
cannot yet identify which years are affected. No raw archive, data file,
cache or log contents were opened in this source inspection.

Corruption in current archive copies does **not** prove that the files used
by the original Hamilton jobs were corrupted. Conversely, internally
consistent derived files do not prove that every intended original week
was present. The approved full-2019 accounting therefore remains conditional
on the frozen derived release. It is not an upstream replication certificate.

## What is needed for the independent rerun

1. For each year, the actual launcher or command and environment overrides,
   particularly panel year, ACS year, state selection and any file cap.
2. The input release and file/partition/calendar manifest used by that run,
   with corruption/replacement status separated from the original executed
   inputs. Preserve both identities when files are replaced.
3. Exact ACS, CBG/CBSA crosswalk and centroid identities and their geographic
   vintages.
4. Run-linked completion evidence for every intended state, output hashes,
   and the code/dependency versions.

These are targeted replication needs, not a reason to postpone unrelated
authorized research. No new Hamilton job, download, source correction or
request to colleagues has been sent by this review. Detailed source
locations and line/hash citations remain in the private review.

Reproduction and verification:
[construction log 116](../docs/data_construction/116_diego_production_code_review.md).
