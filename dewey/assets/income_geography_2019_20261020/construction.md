# 2019 income-roster geography audit

20 October 2026. Complete construction record for Stage A only.
No new income-group mass or finer-area income outcome was computed.

## Authorization, inputs and storage

David explicitly approved the bounded local-geography check linking
`poi_identifiers_2019.csv.gz` with the verified 2019 income reconstruction.
DATA_POLICY records the scope. Originals remain unchanged; row-level
identifiers, coordinates and county assignments stay outside Git.

Private execution-root name: `income_finer_geography_2019_20261020`, in the
project's outside-Git private execution storage. The exact local paths are
retained in its frozen `geography_config.json`; the output directory is
`geography_run_01`. No retry or alternate empirical boundary search occurred.

Input identities:

| Input | SHA-256 |
| --- | --- |
| Existing 2019 identifier file | `a16d637ad32874c25f009a76bde4708adabba27fd445c66560ecfc3deab97123` |
| Public 2019 TIGER/Line county ZIP | `4a2cdcc8a5d58caf88f9dc6595c4d89c51fdb56de738f615a8c5e3814dfcdea5` |
| Verified private income vectors | `f10368f1da580a5e6a1b43ac582744fbb7899cfe60f7d890ca8e7f9f30633417` |
| Prior private accounting | `4423259ddf22ec54accc1734b39d62bf2644f59066d793bc4d70f0a01017b00a` |
| Prior private execution receipt | `789d24ed1655a1839221f63645ff365d6b2ce7bb9622215e1d24b199373bf2c4` |
| Prior full-year verification | `eb097be70c38d9bb7a3133c1e0e84acf2f0f3dcbdbf99ffb6f3c8cdd8d377dc3` |

All execution input identities are enforced by the frozen launch as well as
recorded in this human-readable table.

The source vectors are in the unchanged full-income run recorded in log 117.
The Census ZIP's source URL, archive and topology checks are in log 119.
This audit did not acquire or open original weekly mobility archives.

## Fixed methodology

Read only ID, variant and recorded area columns from the verified income
vectors. Confirm unique variant-ID pairs and invariant recorded county across
variants, then form their venue-ID union. Read the approved identifier CSV as
text; require year 2019 without rounding or partial parsing. Trim identifier
whitespace consistently with the preceding geographic audit.

A coordinate key is usable only if every corresponding row is valid and
there is one distinct finite latitude/longitude pair. Identical duplicates
can collapse; conflicting or partly invalid duplicates remain unresolved.
The left join preserves the complete income union roster.

The public county file is EPSG:4269. Source coordinates are treated as WGS84
under an explicitly unverified operational assumption. The frozen available
operation is the inverse of `NAD83 to WGS 84 (1)`, with longitude-first axes,
stated accuracy 4 m and an enforced area of use. Its actual operation
definition is a no-op; this does not certify the provider's datum or geocode.
Projection-network access is disabled.

Use Shapely `covered_by` against unchanged county polygons. Exactly one county
match and exact agreement with recorded county are required. No snapping,
nearest match, buffer, geometry repair or relabelling is allowed. Restrict
eligibility to recorded contiguous-US/DC counties; project eligible matches
from NAD83 to EPSG:5070 and require finite output.

The minimum eligible share is 99% of the recorded-CONUS/DC union roster.
A fixed SHA-256(ID) modulo-10,000 sample, capped at 5,000 without truncation
or reselection, uses direct polygon predicates rather than the production
spatial index. Saved-output uniqueness and two-way ID/county reconciliation
must also pass.

## Execution, preflight and retained problems

Frozen files:

| Artifact | SHA-256 |
| --- | --- |
| `geography_config.json` | `0a9b14c4a0233a386418304ce2d2812b9c292158c964c9f739091215114e1a14` |
| `geography_launch.json` | `30ed10071fabd178dce4ed983d6f35cdbe0fc7265ffb00b8fb332363616a0260` |
| Main runner | `449ae41024515ec474709cf00207075c9c64f9c1b284349ca2ccac41680cdb3c` |
| Geographic kernel | `f6dccfc71c6b6f5e8d1cf147a2095c7066fc5d88c0789c974faa9c2c41d1164d` |
| Prospective protocol | `0f12c42c519e7fa5908e7e7d0e2a8f2ab6f2dfcc202fbb387ba337b0f9ea72d4` |
| Saved private geographic ledger | `f660f9353877d21f2a176d78010666a411cede201d3d4176d16fb0ff8f49ce21` |
| Private execution receipt | `cc5d5a48f35b1888950dcc44c88fc79695090d6522cd4be3d3f4e3682a190e6b` |

The launch additionally pins imported execution dependencies. Do not edit
these frozen sources or the protocol when reproducing this completed run.
The isolated geographic runtime from log 119 was reused; no package installed.

Before launch, artificial tests exposed an all-null Arrow schema problem
and pandas string inference converting missing counties into text. Explicit
schema and object-series handling fixed these without touching empirical
inputs. Independent code review also found non-integer year acceptance,
potential error-log exception leakage, output creation before a protected-path
check, and launch identity checked too late. These were fixed and regression
tested before freezing. One artificial fixture incorrectly nested source
and output roots; the fixture was corrected rather than weakening the guard.

Combined runner/kernel suite: 120 passed plus 9 subtests in 2.55 seconds,
with warnings treated as errors. The independent reviewer subsequently
cleared the corrected code. Production emitted a DuckDB deprecation warning
about `fetch_record_batch`; it did not fail, alter data or trigger a rerun.
The frozen runner has not been edited to suppress that warning.

The empirical run completed at 2026-10-20T18:25:28.181671+00:00 in
126.497098 seconds (2.1 minutes), exit status zero. Roster reconciliation,
direct-predicate sample and the 99% coverage floor all pass. Every watched
input and execution fingerprint is unchanged. The private receipt retains
detailed diagnostics and runtime versions; no detailed rows or counts are
copied into this public-safe record.

## Reproduction and verification scope

From the project's `code/analysis` folder, use the Python 3.12 environment
and isolated runtime documented in log 119. The original one-run invocation:

```powershell
python -B run_income_geography_audit_2019.py --private-root PRIVATE_ROOT --execute
```

Do not rerun into the original output directory. The runner's `--prepare`
mode accepts explicit source, identifier, county and runtime locations for
a new private root, validates protected-source boundaries and writes a new
frozen launch. Reproduction must reuse the named inputs and retained rules,
not substitute a new provider release or projection.

A separate verifier completed successfully at
2026-10-20T18:39:11.181766+00:00 (the command took 9.3 seconds).
It independently rebuilds the ID/county union roster, full-outer join,
saved-flag eligibility rules, aggregate diagnostics and integer-arithmetic
99% coverage test, and checks every watched artifact/code hash before and
afterward. It reads no income masses or original coordinate rows. It does
not independently rerun the identifier linkage, coordinate projection or
polygon matching; the direct-predicate sample is explicitly inherited from
the frozen Stage A runner, not counted as a new test.

The first real verifier invocation failed closed before assessing the ledger:
its expected relative code paths used forward slashes, while the Windows
runner serialized native backslashes. A metadata-only diagnostic established
identical code hashes and receipt mappings. The verifier alone was corrected
to use the runner's native relative-path representation, with an additional
independent serialization regression test. No frozen execution file, protocol,
source or empirical output changed. The final combined suite passed
147 tests plus 9 subtests in 4.78 seconds, warnings as errors.

Verifier source SHA-256:
`110afd90bc7d2b6f9c06d0aa76bfdfeb3a10c55165b72fbb4f11354170876021`.
The allowlisted, complete verification receipt is
`output/income_finer_geography_2019/verification_income_geography.json`,
SHA-256 `82463d29f2267d3bad5bed2a3f6398806ef2da77872aff854d6ab49cebe68d50`.
It is byte-identical to the saved private verification receipt and contains
only fixed scope/status text, dates, booleans and cryptographic hashes.
Detailed counts, labels, coordinates and exceptions are not exported.
Its `public_release_approved: false` is deliberate: the verifier checks
evidence, not publication permission. The subsequent main-agent safety review
clears only this coarse receipt and the accompanying note/log, not any private
ledger or demographic outcome.

## Next stage is not a result

Stage B's prospective grid family is fixed in the protocol: 20, 10, 5 and
2.5 km, two origins, 5 km primary, county/subcategory intersections and common
venue-ID support across income lookups. Its implementation, independent
arithmetic and joint disclosure checks must be frozen before execution.
No new income contrast, attitude regression, urban-scale effect or causal
interpretation is produced by this audit. Note 118's category-release stop,
home-area-versus-personal-income limits and unknown upstream corruption remain.
