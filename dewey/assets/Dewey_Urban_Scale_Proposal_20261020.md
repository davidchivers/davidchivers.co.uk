# Urban scale, shared destinations and separate venues

20 October 2026. **Detailed research proposal, not a new empirical result.**
This supplements the [prepared urban-scale pilot](https://davidchivers.github.io/davidchivers.co.uk/dewey/urban-scale.html).
It does not amend its frozen protocol, authorise additional data processing,
or replace historical estimates. No real annual-flow reconstruction,
city-size regression or preference model has run under this proposal.

## The recommendation

The useful question is not simply whether large cities are more segregated.
It is **whether access to a mixed activity centre translates into use of the
same establishments, and how much of any separation within the centre is
associated with independently measured product differences**.

Three explanations can produce similar aggregate patterns. Residents may
have different reachable destinations; a common destination may offer
different products; or different groups may use different establishments
even among apparently comparable options. The proposed sequence distinguishes
these observable patterns before attempting a model of preferences.

Start with 2019, one clearly defined service and a verified metropolitan
sample. Reconstruct the income-group composition of venues, then study
centres and their constituent establishments. Add travel-cost and product
information only after the measurement checks pass. Extend to 2017-2019
after that implementation is validated and the additional inputs are
authorised. **Do not begin by fitting a structural co-patron preference model.**

The potential paper is a descriptive account of the gap between shared
destinations and shared establishments, with a disciplined assessment of
access and product differences. Its novelty remains conditional on the
fine-grained evidence and comparison with the literature below. A chain-rule
decomposition alone is not a new mechanism or sufficient contribution.

**Contents:** [Literature](#literature) | [Hypotheses](#hypotheses) |
[Data](#data) | [Measurement](#measurement) | [Regressions](#regressions) |
[Common menus](#common-menus) | [Model](#model) |
[Outputs](#outputs) | [Decisions](#decisions)

## 1. What would be new? {#literature}

Nilforoshan et al. already relate urban scale to experienced segregation,
differentiated venues and bridging hubs. Importantly, their exposure measure
uses time-stamped device encounters, and their methods distinguish fine
POIs from parent activity centres. Our annual origin-composition measure is
different: a tenant-level composition gap would not refute their encounter
result or demonstrate that it overstated actual co-presence. The relevant
comparison is their abstract, activity-specific analysis, bridging-hub
analysis and POI/exposure methods. [Nature, 2023](https://www.nature.com/articles/s41586-023-06757-3)

Couture, Dingel, Green and Handbury's January 2026 paper already separates
travel frictions and demographic preferences in a richer demand framework,
including within-chain comparisons. Its data and identifying restrictions
are not supplied by our annual CBG flows. Their distance-only and
demographic-only counterfactuals should not be treated as additive shares
of a single total. Relevant sections are 2, 4.5 and Table 3 with its
qualification. Simply estimating distance and a crowd-composition regressor
would therefore be neither a safe identification strategy nor an established
novel contribution. [Author paper, January 2026](https://www.jdingel.com/research/CoutureDingelGreenHandbury.pdf)

Beiro et al. study mall-level social mixing in Santiago using home-area
socioeconomic characteristics and a gravity model involving population,
distance and mall size. This is a further predecessor for a
centre-accessibility analysis. The distinction worth investigating here is
the allocation among establishments inside independently identified centres,
not the existence of mall mixing itself. [EPJ Data Science, 2018, sections 3-4](https://link.springer.com/article/10.1140/epjds/s13688-018-0157-5)

These are focused checks of the closest methods, not a claim to have read
every supplement or established novelty exhaustively. A contribution would
need to survive these comparisons **and** deliver information that cannot be
obtained merely by changing the spatial unit of an existing index.

## 2. Three hypotheses and discriminating evidence {#hypotheses}

| Explanation | What we would look for | What that would not establish |
|---|---|---|
| Separate local catchments | Different-income origin areas have different independently defined feasible menus; much separation is between centres rather than within common centres. | That distance caused the separation. Residential sorting, transport access, working locations and venue placement are jointly determined. |
| Differentiated products | Within common centres and one service, allocation differs across independently measured price, format, cuisine, hours or other product attributes. | A causal share attributable to products. Products and locations are supplied in response to demand; omitted attributes remain. |
| Separate venues within a common menu | Different-income origins allocate activity differently among establishments in the same centre, including a predeclared comparable-product subset. | Preference for rich or poor co-patrons, discrimination, or interpersonal avoidance. Unmeasured products, timing, trip purposes and access can remain. |

These mechanisms can coexist. The word **chiefly** needs care: we can quantify
where measured separation is concentrated, but cannot assign causal
percentages to these three explanations using an accounting identity.

A centre is a geographic grouping of destinations. A catchment is an
origin-specific set of feasible destinations. They are not interchangeable.
A destination county is neither. A broad subcategory is also not a
measurement of price or quality.

## 3. Data, units and what is actually available {#data}

The outcome concerns **recorded activity from neighbourhoods with different
median household incomes**, not observed personal income. The starting
groups are the existing ten national CBG income groups, `nat_decile_tdw`.
They were formed from unweighted CBG quantiles, not equal-sized population
groups. For 2019, retain the documented ACS 2015-2019 five-year convention.
Do not silently substitute per-capita income or a later ACS release.

The initial object is destination-based: venues in a metro and their
retained origins, including origins outside that metro. It is not the
resident-based exposure measure previously linked to county outcomes.
Neither annual composition nor common centre attendance establishes that
people met at the same time. Workers cannot be distinguished from customers
without additional evidence.

| Input | Present state | Role in this proposal |
|---|---|---|
| Final 2017-2019 harmonised POI indices | Approved for the previously bounded quality and venue-count checks. | Existing scalar indices, IDs, categories, recorded areas and reconciliation targets. Scalars cannot recover labelled group masses. |
| 2019 annual origin-flow file and harmonised ACS lookup | Schemas checked; separate local processing approval still pending. | Reconstruct group-by-venue masses, missing-income coverage and, later, origin-preserving allocations. |
| Metro classification and population | Public reference prepared and checked; producer geography provenance unresolved. | Same-vintage metropolitan sample and city-size denominator. Not all recorded area codes are metros. |
| Historical venue coordinates, centre boundaries and tenant inventory | Not supplied by the three inspected schemas; suitable project-wide input not yet established. | Identify actual centres, memberships, non-centre venues and opportunity sets independently of observed visits. |
| Historical product attributes | Not yet established for this design. | Price, format, chain, cuisine, capacity and hours, with source dates and linkage coverage. Category alone is insufficient. |
| Origin geography and relevant travel costs | Additional verified inputs required. | Geographic opportunity and common-menu comparisons. Home-to-venue cost is only a proxy when actual trip origins are unknown. |

The existing engineering adapter checks rosters and joins, reconstructs
income-group masses and reconciles inherited scalars. Its 99 artificial-data
tests are a prior software result, not a new test run or validation of real
inputs. It currently uses destination county and literal `SUB_CATEGORY`;
it does not identify centres or estimate city-size gradients. It discards
origin identities after constructing group vectors, so common-menu analysis
requires a separately specified, authorised origin-preserving construction.

The deterministic engineering sample is not a national inferential sample.
The previously reported attenuation in the venue-count association concerned
**racial diversity**, not a newly estimated income-separation result.

## 4. Measurement and construction {#measurement}

### 4.1 Reconstruct before interpreting

Let \(v_{oj}\) be a valid, positive recorded annual weight from origin CBG
\(o\) to venue \(j\). Let \(g(o)\) be its known income group. Define

$$
x_{gj}=\sum_{o:g(o)=g}v_{oj},\qquad
p_{gj}=\frac{x_{gj}}{\sum_{g,j}x_{gj}}.
$$

Exclude origins with missing income from both the numerator and denominator;
do not impute them. Report their known positive weight separately from
invalid or null weights whose mass is unknown. Preserve preferred and strict
lookup versions and use a fixed common-support comparison when interpreting
their difference. Unreported origin-venue pairs are not observed zeros.

Join on verified identifiers, not row positions. Stop on unexplained roster,
metadata or scalar-reconciliation failures. The producer's original
construction, annualisation and suppression rules remain separate provenance
questions; successful final-file reconciliation alone does not answer them.

### 4.2 Define centres and products without using the outcome

Start with a single service. Full-service restaurants are a candidate, not
an empirically selected winner: confirm their availability and historical
product coverage without inspecting the resulting segregation gradient.
Freeze the service, centre definitions, product taxonomy and inclusion
rules before estimation.

Use independently dated centre boundaries and a complete tenant inventory
where possible. A venue must have exactly one centre assignment for the
decomposition. Resolve overlapping boundaries by a rule fixed in advance.
Keep venues outside centres explicitly, for example as singleton units, and
report their contribution separately. Do not combine all outside venues
into one artificial common centre. Compare alternative fixed geographic
units as sensitivity checks, not as the same economic object.

Count constituent establishments consistently. Do not add a parent's recorded
visits to its tenants' recorded visits and call them separate activity.
If duplicate attribution cannot be reconciled, restrict the estimand to
retained tenant-attributed activity and state that limitation. Membership
derived solely from positive visits cannot serve as independent availability.

### 4.3 An exact accounting, with limited interpretation

Within one service, metro and year, \(G\) is the origin-income group, \(J\)
the venue, \(C=C(J)\) its centre and \(P=P(J)\) a predeclared discrete product
bin. Products and centres can cross; both must be fixed attributes of the
venue in this accounting. With entropy in natural-log units,

$$
I(G;J)=H(G)-\sum_jp_jH(G\mid J=j).
$$

The centre-first identity is

$$
I(G;J)=I(G;C)+I(G;P\mid C)+I(G;J\mid C,P).
$$

The product-first identity is

$$
I(G;J)=I(G;P)+I(G;C\mid P)+I(G;J\mid C,P).
$$

These label separation **between centres**, **between measured product
types within centres**, and **between venues within centre-product cells**.
Reversing the order reallocates the first two components; report both.
Do not rename these components access, product and preference effects.

Use the identical flow universe and weights throughout. Show raw nats and
each component divided by the same \(H(G)\); normalisation is undefined when
\(H(G)=0\). Report group composition and coverage alongside the normalised
index. A finer product partition can mechanically move separation out of
the final term. A cell with one venue has zero within-cell separation by
construction, not demonstrated integration.

The gap between a centre's pooled diversity and the weighted diversity of
its tenants is nonnegative by the entropy identity. **A positive gap alone
is therefore not a discovery.** Its magnitude, support, robustness and
association with scale are the objects of interest. Without independently
measured product bins, report only the centre/venue split and leave the
product channel unresolved.

## 5. City-size regressions {#regressions}

For component \(r\), let \(D^r_m\) be its raw or normalised value in metro
\(m\) in 2019. The first regression is

$$
D^r_m=\alpha^r+\beta^r\log N_m+\varepsilon^r_m,
$$

where \(N_m\) is population on the verified metro definition. An association
with a doubling of population is \(\beta^r\log 2\), in the displayed outcome's
units. Report coefficients, confidence intervals, metro counts, outcome
means and the exact weighting rule. No coefficient is currently available.

Equal-metro weighting is primary. Population weighting is a predeclared
sensitivity with a different target; it does not correct mobility coverage.
Use identical metros, covariates and regression weights for the total and
all components, so their OLS slopes add exactly. Fit raw and normalised
outcomes as distinct families. Use metro-level heteroskedasticity-robust
uncertainty for the 2019 cross-section and assess spatial dependence
separately; millions of visits do not create millions of independent cities.

A second, explicitly conditional specification adds a small, predetermined
set of geography and measurement covariates, such as population density,
residential income composition and documented coverage, when compatible
sources exist. Report it beside, not instead of, the unadjusted gradient.
Product variety and venue count are potential pathways: adding them is a
descriptive conditioning exercise, not a causal mediation estimate.

If 2017-2019 are later authorised and validated, the first extension is

$$
D^r_{mt}=\alpha^r+\beta^r\log N_{mt}+\lambda^r_t+\varepsilon^r_{mt}.
$$

Use year effects and metro-clustered uncertainty. This is a pooled
association, largely reflecting differences across metros. Adding metro
effects changes the question to short-run within-metro change; three annual
observations and small population changes do not provide a convincing
city-growth experiment. Show those distinctions rather than presenting
fixed effects as a general solution to confounding.

Stable venue support, missing-income coverage, product-link selection,
centre definitions and sensitivity to influential metros must be reported
alongside the main gradient. Larger menus and sparse observation can
mechanically increase measured separation. Do not implement a finite-sample
correction by treating weighted annual activity as independent people.

## 6. The most informative comparison: common menus {#common-menus}

First ask whether different-income origins have overlapping independent
menus and whether they use the same centres. Then, separately, compare
allocations inside a centre conditional on reaching it. Conditioning on
arrival selects the sample and can create selection bias; it is a different
estimand, not proof that access no longer matters.

Match or balance **different origin CBGs** on geographic position and their
vector of travel costs to the same candidate venues. It is not possible to
compare differently classified people within one CBG when everyone has
been assigned the same neighbourhood-income label. Record overlap and
discard unsupported comparisons using thresholds fixed before outcomes.

The feasible menu must come from historical availability, not the union of
venues those groups happened to visit. Walking distance within a shopping
centre does not establish equal affordability, opening hours, disability
access or information. Home-to-centre travel costs also need special
caution: annual home-origin records do not show whether the trip began at
home, work or another destination. Without direct-trip information, call
the adjustment **home-based geographic accessibility**, not actual trip cost.

On a fixed common menu, describe group differences in allocation across
tenants. Then examine the same origins, tenants and weights using
independently measured products. Include a narrow, predeclared
chain/format/price comparison if coverage permits. A chain comparison is
useful but does not hold every product or access attribute constant.

| Observed pattern | Defensible reading |
|---|---|
| Separation concentrated between centres; little within supported common menus | Consistent with a geographic allocation account, conditional on the quality of the accessibility proxy. |
| Within-centre separation concentrated across measured product bins | Consistent with product differentiation accounting for part of the recorded pattern. |
| Separation persists among comparable venues in supported common menus | A remaining within-menu allocation difference; grounds to investigate missing attributes or preferences, not an estimate of either. |
| The pattern disappears under stable support or coverage checks | Measurement or sample composition may be central. This is a result to report, not a reason to change the outcome until it returns. |

## 7. A conditional allocation model, only after its data gate {#model}

Do not fit a demand model on positive reported pairs while coding missing
pairs as zero. Before any such estimation, establish which origin-venue
pairs were observable, the suppression process, genuine zero semantics and
the relevant availability period. If that cannot be established, retain
the observed-flow accounting and stop the preference exercise.

For a supported menu, a possible descriptive conditional model is

$$
\mathbb{E}[v_{oj}\mid o,C(j)=c]
=\exp\left\{\alpha_{oc}+\delta_j+
f_{g(o)}(d^{home}_{oj})+
X_j^\prime\theta_{g(o)}\right\}.
$$

Here \(\alpha_{oc}\) absorbs the origin's activity at that centre,
\(\delta_j\) absorbs common venue attractiveness, \(d^{home}_{oj}\) is the
home-based cost proxy, and \(X_j\) contains independently measured historical
products. One income group is the reference for product interactions.
Venue effects absorb product main effects; origin-centre effects absorb
origin-income main effects. Variation and rank conditions must be checked,
particularly because travel costs to tenants in one centre may barely vary.

PPML is a candidate estimator for a conditional mean with nonnegative
weights; it does not require those weights to be independent Poisson people.
It also does not repair censoring, omitted products or selection. Appropriate
clustering must reflect repeated origins and destinations and the number of
independent centres/metros; do not report pair-level naive precision.
Diagnose separation and all-zero fixed-effect groups, log dropped observations,
and enforce the same effective sample when comparing specifications.

Compare an access-proxy specification with product interactions on the
identical observations. Assess out-of-sample allocation prediction, not just
in-sample fit. For a venue-effect model, hold out origin areas while retaining
training-supported venues, conditioning predictions on held-out
origin-centre totals. Normalise predicted venue intensities within each
supported menu to that total; do not reuse an unknown origin fixed effect.
Do not claim it predicts unseen cities using unobserved
venue effects. A genuinely held-out-city exercise needs a separately
specified transferable model of attractiveness.

The model's parameters describe area-group allocation under its maintained
assumptions. They are not personal-income preferences. Do not put the
contemporaneously constructed co-patron composition on the right-hand side
and interpret its coefficient as a preference: the same choices construct
that regressor. Nor are reductions in separation or prediction error
additive causal mechanism shares.

A structural or causal extension would require further restrictions and
evidence: credible exogenous changes to access or products, dated exposure,
pretrend checks, substitution across the full relevant network and an
observation model. Ordinary venue entry or disappearance in a panel is
not such a design. No failed closure design is restarted here.

## 8. What the paper's tables and figures would show {#outputs}

All entries below are **planned outputs, not completed estimates**.

| Output | Exact purpose |
|---|---|
| Table 1: construction and sample | Metro definition; venue/centre support; retained activity; missing-income weight; unknown-weight cases; parent/tenant exclusions; product-link coverage. Include the units and denominator at each step. |
| Table 2: separation accounting | Total and centre/product/within-cell components, both orderings, raw nats and common-entropy normalisation, on identical support. |
| Table 3: city-size association | 2019 coefficient, confidence interval, population-doubling association, means and metro count for every component; equal-metro and population-weighted panels. |
| Table 4: common-menu comparisons | Origin support and balance; tenant allocation differences; the fixed-sample product comparison. Include a stopped/not-estimable entry if the zero/menu gate fails. |
| Figure 1: measurement sequence | Origins to centres to tenants, with a separate product classification and explicit missingness/observation gates. Conceptual, not a data result. |
| Figure 2: city-size gradient | Metro-level total and component plots with coverage and influential observations visible; no selected positive panels. |
| Figure 3: pooled-centre versus tenant composition | The distribution of supported centre gaps and their scale association, with the mechanically nonnegative gap explained. Public release only after disclosure review. |

Retain racial and income outcomes as distinct concepts. Do not quietly
substitute a racial result for an income result. This branch does not
estimate attitude effects or validate expected worker demographics.
Historical null and contrary results, correction 70a, negative equal-county
validation and failed disclosure/inference gates remain in force.

## 9. Implementation and stop decisions {#decisions}

1. **Permission and provenance.** Obtain the pending, named approval for the
   2019 annual-flow and harmonised ACS lookup. Confirm the producer's
   geographic construction and source versions. Do not broaden access to
   original weekly files or employee workbooks.
2. **Reconstruction.** Run the bounded engineering check privately; reconcile
   by ID and stop on unexplained differences. Only then freeze a substantive
   metro sample and its coverage requirements before computing gradients.
3. **Centre and product feasibility.** Inventory candidate historical
   coordinates, centre/tenant and product sources at metadata level. Record
   licensing, dates, identifier bridges and missingness. Do not acquire or
   process restricted additions without their own scope. If centres cannot
   be identified, the current county decomposition remains a coarse
   descriptive audit, not the proposed centre paper.
4. **Descriptive evidence.** Estimate the city gradient and centre/tenant
   accounting on the frozen sample. Keep nulls and sensitivity failures. If
   the result is explained by unstable coverage or is merely the inevitable
   gap from aggregation, narrow the contribution or stop.
5. **Discriminating comparisons.** Proceed to common menus and products only
   with the required independent inputs. If product data fail, do not claim
   to have separated products from preferences. If zero/observation semantics
   fail, do not fit the allocation model.
6. **Paper decision.** Continue only if supported evidence adds a substantive
   distinction beyond existing city-size and hub results. A precise null or
   measurement finding can be informative; publication cannot be promised.

Each empirical stage needs a versioned protocol before its outcomes are
inspected, input hashes, join/exclusion counts, exact code and environment,
private intermediate storage and an independent verification record.
Pre-existing outputs are not to be overwritten. Disclosure review must
consider combinations with previous releases, not just each new table in
isolation. The website and shared Project are documentation snapshots,
not access to licensed data or proof that coauthors can run the code.

**Immediate decision:** approve the bounded reconstruction if its named
inputs may be used, and identify the original geography/venue-metadata
construction. The more ambitious common-menu design should follow that
check, not precede it.
