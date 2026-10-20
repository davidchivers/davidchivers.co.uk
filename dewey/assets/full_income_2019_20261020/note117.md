# Home-area income separation across venues: full 2019 accounting

20 October 2026. Completed, verified descriptive calculation on the frozen
derived release. This is not a regression, a new causal result, or
certification of the original weekly data.

## Main finding

In the preferred construction, **52.1% of measured between-venue income
separation occurs between venues within the same recorded county and
subcategory**. Differences between counties account for 42.1%, with a further
5.8% between subcategories within counties. These are accounting components,
not causal explanations.

The question is therefore not only whether people from different income
backgrounds visit different types of places or different counties. Substantial
differences remain among venues carrying the same service label in the same
county. That is a reason to investigate more local geography and venue
characteristics, not yet a finding of preferences or discrimination.

![Both accounting orders and income lookups](../output/full_income_accounting_2019/national_accounting.png)

## Data and construction

The calculation joins the saved 2019 annual origin-CBG flow dictionaries to
the harmonized POI indices by exact venue ID, and classifies origins using
the existing harmonized ACS income lookup. It uses the 2015-2019 ACS
five-year wave on harmonized 2020 block-group geography.

The ten groups are **national unweighted ranks of CBG median household
income**, not deciles of individual visitors, equal-population deciles,
personal earnings, or per-capita income. We use the preferred NHGIS lookup
and retain the strict one-source sensitivity construction. The historical
`tdw` field names in this release are checked against their NHGIS aliases.
Weighted source medians do not recover exact target-geography medians.

Weights are recorded positive annual origin-flow counts. They are neither
unique annual people nor annualized raw visits. Origins without usable
income classification are excluded from both the classified numerator and
denominator, without imputation. Unknown/null flow amounts are not assigned
zero observed visits.

Every matched venue is reconstructed. National accounting requires a recorded
county, a literal `SUB_CATEGORY`, and positive classified income mass.
Missing recorded MSA is not an exclusion. Each lookup has its own eligible
support. No employee, attitude, social-capital or city-size variables enter.
This is **destination-based accounting**, not resident-origin exposure.

| Support and coverage | Preferred NHGIS | Strict |
|---|---:|---:|
| Eligible venues | 3,525,080 | 3,506,222 |
| Recorded county codes | 3,136 | 3,136 |
| Literal subcategory labels | 624 | 623 |
| Classified share of known positive origin-flow weight, all venues | 97.30% | 68.00% |
| Eligible venues without recorded MSA | 187,191 | 185,800 |

The coverage percentages use all source venues, not just the eligible
accounting sample. Recorded geographic fields are not independently
certified locations. These counts do not establish representative coverage
of the population or its trips.

## Measurement and complete accounting

Let G denote home-area income group, V venue, K subcategory, and A county.
Pool eligible recorded flow nationally within each lookup. Total separation
is `I(G;V) = H(G) - H(G|V)`: the difference between pooled income-group
entropy and the flow-weighted average entropy within venues.

All normalized components use the same pooled `H(G)` within a lookup.
The normalized total is **0.179929** under the preferred lookup and
**0.195204** under the strict lookup. Zero would mean identical group
composition at every venue; one would mean each venue contains only one
income group. A value of 0.18 does not mean that 18% of visitors are segregated.
The raw totals are 0.409438 and 0.443200 nats, respectively.

The following tables instead divide each component by total measured
separation `I(G;V)`, so each three-row panel sums to 100%. This is a
different denominator from the normalized index above.

**Subcategory first**

`I(G;V) = I(G;K) + I(G;A|K) + I(G;V|A,K)`

| Component: share of total separation | Preferred NHGIS | Strict |
|---|---:|---:|
| Between subcategories | 3.37% | 3.08% |
| Between counties within subcategories | 44.54% | 42.59% |
| Between venues within county and subcategory | 52.09% | 54.32% |

**County first**

`I(G;V) = I(G;A) + I(G;K|A) + I(G;V|A,K)`

| Component: share of total separation | Preferred NHGIS | Strict |
|---|---:|---:|
| Between counties | 42.06% | 39.77% |
| Between subcategories within counties | 5.84% | 5.91% |
| Between venues within county and subcategory | 52.09% | 54.32% |

The first two allocations depend on ordering; the residual and total do not.
These are not category fixed-effect coefficients or effects of adding venues.
The strict result retains the broad pattern, but its much lower flow coverage
and different eligible sample prevent a fixed-support interpretation of the
difference. Both constructions also share upstream data and assumptions.
All six components in nats, normalized units and component shares are in the
[complete table](../output/full_income_accounting_2019/national_accounting.csv).

## What was checked

All **3,526,891 venue IDs** match one-to-one between the two source rosters,
with no duplicate IDs or recorded MSA/combined-category conflicts. All
**31,742,019 saved-scalar comparisons** pass: origin-flow total plus four
income measures under each lookup. The largest discrepancy is 8.88e-16.
The pre-specified absolute/relative tolerances were unchanged.

The separate verifier checks the full artifact identities, national
saved-scalar support/mass accounting, mathematical identities and disclosure
gates. All **6,686 retained venue-by-lookup vectors** from the independently
verified pilot agree exactly, including group positions and membership.
This reuses the pinned pilot verification; it does not rerun the old pilot
or independently reconstruct every new venue a second time.

Direct information calculations agree with entropy differences; both
accounting orders and normalization/bounds pass. The national release passes
the frozen support and maximum-venue-contribution gates and a separate
field/value disclosure review. There are 119 passing focused artificial-data
tests, including rejection of altered snapshots and inconsistent summaries.
The three renderer tests also pass after the final label-only adjustment.

The local full-year run took **39.8 minutes**, including hashing and roster
construction. Verification, software tests, review and reporting took
additional time. No Hamilton job was submitted. Originals were read-only
and unchanged; detailed rows, vectors and working databases remain private.

## Limits and next decision

1. **Upstream integrity remains unresolved.** David supplied the raw-download
   location but cannot identify which years are corrupted. No original raw
   archive was opened. Current raw-copy corruption does not prove historical
   job-input corruption, and internal consistency does not prove complete
   original weeks, valid partition handling or correct production assembly.
   [Source-code review 116](116_diego_production_code_review.md) records
   the relevant risks and remaining run-manifest needs.
2. **Income is a home-neighbourhood attribute.** Rich and poor residents can
   share a CBG. These results do not identify individual incomes.
3. **Annual clientele composition is not social contact.** Visitors can
   attend at different times and never interact; workers are not identified.
4. **County and subcategory are coarse controls.** The residual can include
   residential location, travel costs, different neighbourhood markets,
   prices, chains and other products. It is not evidence that people offered
   the same menu prefer different co-patrons.
5. **No inference or causal effect has been estimated.** Recorded flow mass
   is not a sample of independent people. There are no standard errors,
   confidence intervals or attitude coefficients in this exercise.

**Decision: continue, narrowly.** This supplies the full-year descriptive
accounting that the small engineering sample could not support. The next
useful test is whether the within-county/subcategory component remains
substantial after independently defining finer local markets and measuring
product differences. That requires a new prospective linkage/support rule
and the appropriate file-specific permission; it has not been run here.
Keep original weekly replication as a separate audit, preserve contrary
results from earlier count and attitude exercises, and do not promote this
accounting identity alone into a publication contribution.

Protocol: [full-year scope](../docs/protocols/full_income_accounting_2019_20261020.md).
Operations and replication: [construction log 117](../docs/data_construction/117_full_2019_income_accounting.md).
Shared delivery is recorded separately; this note is not a Project upload
or website-publication claim.
