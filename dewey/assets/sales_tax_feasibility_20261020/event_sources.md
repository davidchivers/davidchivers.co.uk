# Sales-tax events: bounded public-source feasibility

Retrieved/checked **20 October 2026** throughout. Public policy documents,
download metadata and bounded jurisdiction-rate metadata only; no restricted
mobility files, messages, purchases or full datasets acquired. No estimation.
Only this workstream file is owned by this task.

## Scope and outcome-blind selection

Screen the project's verified annual-file years **2017-2019**. Annual-file
verification does not certify the original weekly construction or usable monthly
outcomes; those integrity questions remain open (project STATUS; notes 96/116).
The shortlist below was assembled from effective dates, tax coverage and public
source availability, without reading event-specific visits or mixing outcomes.
It is not an exhaustive national inventory or a validated analysis sample.
Freeze any expanded event universe, category bridge, geography, controls and
failure rules before inspecting outcomes; retain failed and null cases.

Here, permanent means an ongoing policy change rather than a temporary shopping
holiday, not an immutable rate. New Jersey's first reduction was one step in an
announced permanent reduction schedule, subsequently superseded by its second.

## Four concrete event-date cases

| Jurisdiction and effective date | Old -> new rate | Base and annual-window limitation |
|---|---|---|
| New Jersey, 2017-01-01 | Standard state sales/use tax **7% -> 6.875%** (-0.125 percentage points) | Taxable tangible goods, specified digital products and enumerated services, not all purchases. No pre-event annual observation in 2017-2019. |
| New Jersey, 2018-01-01 | Standard state sales/use tax **6.875% -> 6.625%** (-0.25 points) | Same broad statutory base, subject to separate exemptions/base changes. One pre-step year, 2017, already exposed to the first cut; two post-step years. |
| Sacramento city, California, 2019-04-01 | Combined rate **8.25% -> 8.75%** (+0.50 points); city Measure U component **0.50% -> 1%** | Taxable retail goods/use, not a general personal-services tax. Two prior annual observations; 2019 contains only nine post-change months. |
| Des Moines **Polk County portion**, Iowa, 2019-07-01 | Combined ordinary sales rate **6% -> 7%** (+1 point); local option **0% -> 1%** | State-taxable goods and enumerated services, including barber/beauty services, subject to local exceptions. Two prior years; only six post-change months in 2019. Not the entire city indiscriminately. |

**New Jersey verification and complications.** The Treasury's contemporaneous
[27 December 2017 release](https://nj.gov/www.nj.gov/treasury/news/2017/p12272017a.pdf)
confirms both dates/rates and the surviving UEZ reduced-rate transition,
3.4375% -> 3.3125%. The
[2017 tax expenditure report](https://www.nj.gov/treasury/taxation/pdf/taxexpenditurereport2017.pdf)
records expiration of five UEZ designations at end-2016; the
[new-laws record](https://www.nj.gov/treasury/taxation/newlegislation.shtml)
records their 2018 reinstatement. Do not assign the standard cut to every
retailer: zone location, business eligibility and transaction type matter.
[Treasury's 2018 changes](https://www.nj.gov/treasury/taxation/whatsnew2018.shtml)
also document estate-tax abolition and retirement-income exclusions; the
[2017 annual report](https://www.nj.gov/treasury/taxation/pdf/annual/2017.pdf)
describes the wider fuel/EITC/veterans package. Anticipation, disposable-income
changes and transport costs confound a pure sales-price interpretation.
Neighbouring-state shoppers and businesses are potential spillover recipients,
not automatically untreated controls.

**Sacramento verification and complications.** Official
[CDTFA notice L-595, pages 1/3](https://www.cdtfa.ca.gov/formspubs/l595.pdf)
confirms the rates, effective date and replacement of the expiring half-cent
levy, rather than a one-point net increase. The city's
[official financial statement, PDF page 77](https://www.cityofsacramento.gov/content/dam/portal/treasurer/DebtManagement/officialstatements/lease-revenue-revenue/Water_Revenue_Refunding_Bonds,%20Series%202020.pdf)
confirms removal of the sunset. Measure U finances general municipal services:
spending on parks, libraries and neighbourhoods can change destinations directly.
L-595 also records simultaneous increases in West Sacramento and Roseville;
neither is a clean unchanged-rate control. Municipal fiscal conditions, electoral
selection and cross-border substitution remain concerns.

**Des Moines verification and complications.** The official
[Polk assessor's summer-2019 bulletin](https://www.assess.co.polk.ia.us/info/web/realtalk/2019/RealTalkSummer19.pdf)
identifies the July effective date and increase to 7% in six municipalities
(indexed text accessible; direct PDF returned 403). Independent live verification
through the [Iowa state rate service](https://geoservices.iowa.gov/arcgis/rest/services/revenue/SalesTaxRates/MapServer/1)
returned `Des Moines (Polk)`, rate `0.01`, start `2019-07-01`, end `null`;
the Warren portion instead has a 2016 start. Query: `name='Des Moines (Polk)'`,
fields `name,taxtype,taxrate,startdate,enddate`, `returnGeometry=false`.
The [city's ballot proposal](https://councildocs.dsm.city/Resolutions/20181217/56b.pdf)
has no sunset and allocates half to property-tax relief; this is a proposal,
not the enactment certificate. The live state record supports an ongoing levy;
retain final ballot/ordinance verification as a remaining documentary check.
Property-tax relief, infrastructure spending, coordinated neighbouring adoptions
and Iowa's separate 2019 tax reforms complicate controls. Check neighbours'
entire rate histories, not their present-day rates.

## Hair salons: jurisdiction and year matter

- **Iowa, 2019:** [Code 423.2(5), (6)(g), page 10](https://www.legis.iowa.gov/docs/code/2019/423.pdf)
  expressly taxes barber/beauty services at 6%; the
  [2019 local-option statute, 423B.5](https://www.legis.iowa.gov/docs/code/2019/423B.pdf)
  supplies the local framework. The
  [Revenue salon guide](https://revenue.iowa.gov/taxes/tax-guidance/sales-use-excise-tax/barber-and-cosmetology-arts)
  confirms local-option sourcing by first use. This is a plausible haircut-price
  treatment, not merely tax on bottles of shampoo. Pass-through is unmeasured.
- **California, 2019:** [Regulation 1506(b)](https://cdtfa.ca.gov/lawguides/vol1/sutr/1506.html)
  treats barbers/beauty operators as consumers of service inputs and retailers
  of separately sold goods; its amendment history ends in 2016. Ordinary salon
  service charges are not the Sacramento treatment base. Product sales and
  input costs remain exposed, so salons are not perfect unaffected controls.
- **New Jersey, 2017/2018: historical confirmation incomplete.** Official
  [ANJ-19](https://www.nj.gov/treasury/taxation/pdf/pubs/sales/anj19.pdf) exempts
  cutting/styling and distinguishes taxable product sales and certain spa
  services, but the retrieved edition is **May 2023**. Do not silently backcast
  it or label all salon receipts treated. Obtain contemporaneous guidance or
  a verified statutory history before assigning 2017/2018 salon-service status.

## Rate histories, boundaries and access

**Public, no account needed:** NJ's dated bulletins above support the statewide
schedule. [CDTFA's historical archive](https://cdtfa.ca.gov/taxes-and-fees/archive-rates.htm)
offers dated 2017-2019 city/county total-rate PDFs; its
[current download page](https://cdtfa.ca.gov/taxes-and-fees/sales-use-tax-rates.htm)
offers XLSX/XLS and operative/sunset information, not automatically historical
geometry. Iowa's official
[rates-and-jurisdictions XLSX](https://revenue.iowa.gov/media/195/download?inline)
returned HTTP 200 and spreadsheet MIME type to a HEAD request; contents were
not downloaded/validated. Its public GIS layer supports JSON/GeoJSON and
start/end fields, but these do not establish historical polygon versions.

[Census TIGER 2017](https://www2.census.gov/geo/tiger/TIGER2017/),
[2018](https://www2.census.gov/geo/tiger/TIGER2018/) and
[2019](https://www2.census.gov/geo/tiger/TIGER2019/) public download directories
provide STATE, COUNTY and PLACE boundary archives. Use state geometry for NJ's
standard regime, incorporated-place geometry for Sacramento, and city/county
intersection for Des Moines (Polk). Annual Census vintages are starting points,
not certified event-day tax maps: reconcile annexations and legal boundaries.
NJ additionally needs historical UEZ boundaries and eligible-business records.
ZIP codes, postal city names and 2020 CBGs cannot substitute for tax geography.
No authenticated/purchased source is required for this documentary screen;
historical special-zone/business eligibility access remains unverified.

## Recommendation and unresolved needs

**Public-source feasibility: yes; causal readiness: no.** Prioritise Des Moines
for further documentary work on directly taxed salon services, Sacramento for
taxable-retail comparison, and NJ 2018 as a weak, bundled statewide alternative.
NJ 2017 lacks an in-window pre-period. Neither local case has a complete
post-change calendar year. Calendar fractions are not validated exposure
weights, and nonlinear annual mixing indices cannot simply be split/prorated.

These are **four event-date cases, not four independent policy clusters**:
both NJ cuts share one legislative package; co-adopting localities and thousands
of venues do not supply independent policy assignments. Few-cluster inference,
pre-trends, contemporaneous policies, pass-through and spatial spillovers remain
unresolved. Freeze border buffers and more distant comparison areas, audit
their tax histories, and distinguish substitution from overall mixing changes.
Never promote a case because its visits or demographic results look promising.

Exclude sales-tax holidays from this annual design. The 2019 Iowa statute's
two-day August clothing exemption is a temporary, category-specific event,
not a permanent rate change. Annual/monthly totals may contain its activity
but cannot isolate holiday timing or shopping displaced across days. A separate
daily/weekly design requires independently validated time resolution and fresh
file-specific permission. No contact, attitude or causal claim follows here.
