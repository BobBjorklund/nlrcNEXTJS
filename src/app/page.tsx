"use client";
import React, { useMemo, useState } from "react";

/**
 * NLRC Intake — Single Page Wireframe (Lean + Responsive)
 * - Boolean/choice gates reveal ONLY the applicable follow‑ups
 * - Income sources: multi‑select; only show amounts for chosen sources
 * - No external UI libs; Tailwind-friendly
 */
const SectionProgressContext = React.createContext<{
  register: (id: string, required: boolean, filled: boolean) => void;
  update: (id: string, filled: boolean) => void;
  unregister: (id: string) => void;
} | null>(null);

export default function NLRCIntakeSinglePage() {
  // ===== Progress states ======
  const [sectionProgress, setSectionProgress] = useState<
    Record<string, { completed: number; total: number }>
  >({});

  // stable factory that returns a stable callback for each title
  const progressCB = React.useCallback(
    (title: string) => (completed: number, total: number) => {
      setSectionProgress((s) => {
        const prev = s[title];
        // avoid useless re-renders if values didn’t change
        if (prev && prev.completed === completed && prev.total === total)
          return s;
        return { ...s, [title]: { completed, total } };
      });
    },
    []
  );
  // ===== Visibility gates =====
  const [hasHouseholdMembers, setHasHouseholdMembers] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [hasHealthIssues, setHasHealthIssues] = useState(false);
  const [hasHospitalizations, setHasHospitalizations] = useState(false);
  const [hasMedications, setHasMedications] = useState(false);
  const [hasConvictions, setHasConvictions] = useState(false);
  const [onProbationParole, setOnProbationParole] = useState(false);
  const [selfHarmHistory, setSelfHarmHistory] = useState(false);
  const [needsServices, setNeedsServices] = useState(false);
  const [hasEducation, setHasEducation] = useState(false);
  const [hasEmployment, setHasEmployment] = useState(false);
  const [hasSubstanceUse, setHasSubstanceUse] = useState(false);
  const [wantsSpiritualSection, setWantsSpiritualSection] = useState(false);
  const [hasGoalsNeeds, setHasGoalsNeeds] = useState(false);

  // ===== Specific choice states controlling conditional fields =====
  const [preAdmission, setPreAdmission] = useState("");
  const [insOtherChecked, setInsOtherChecked] = useState(false);
  const [servicesOtherChecked, setServicesOtherChecked] = useState(false);
  const [veteran, setVeteran] = useState(false);
  const [leftPick, setLeftPick] = useState<string[]>([]);
  const [rightPick, setRightPick] = useState<string[]>([]);
  const [insVAChecked, setInsVAChecked] = useState(false);
  const [insMedicaidChecked, setInsMedicaidChecked] = useState(false);
  const [insMedicareChecked, setInsMedicareChecked] = useState(false);
  const [hasAllergiesToggle, setHasAllergiesToggle] = useState(false);
  const [hasPrimaryCare, setHasPrimaryCare] = useState(false);
  const [hasExamResultsToggle, setHasExamResultsToggle] = useState(false);
  const [hasPendingCases, setHasPendingCases] = useState(false);
  const [hasRestrainingOrders, setHasRestrainingOrders] = useState(false);
  const [isRegisteredSO, setIsRegisteredSO] = useState(false);
  const [isCourtMandated, setIsCourtMandated] = useState(false);
  const [hasFinesRestitution, setHasFinesRestitution] = useState(false);
  const [hasReleaseConditions, setHasReleaseConditions] = useState(false);
  const [hasTechRestrictions, setHasTechRestrictions] = useState(false);
  const [svcHousing, setSvcHousing] = useState(false);
  const [svcMoneyMgmt, setSvcMoneyMgmt] = useState(false);
  const [svcRecreation, setSvcRecreation] = useState(false);
  const [svcLegal, setSvcLegal] = useState(false);
  const [svcEntitlements, setSvcEntitlements] = useState(false);
  const [svcHealthcare, setSvcHealthcare] = useState(false);
  const [svcFamily, setSvcFamily] = useState(false);
  const [svcVocational, setSvcVocational] = useState(false);
  const [svcTreatment, setSvcTreatment] = useState(false);
  const [relFatherUp, setRelFatherUp] = useState("");
  const [relMotherUp, setRelMotherUp] = useState("");
  const [selectedSubstances, setSelectedSubstances] = useState<string[]>([]);
  const [primarySubstance, setPrimarySubstance] = useState("");
  const [isAbstinent, setIsAbstinent] = useState(false);
  const [hadTreatment, setHadTreatment] = useState(false);
  const [belongsFaithCommunity, setBelongsFaithCommunity] = useState(false);
  const [wantsSpiritualSupport, setWantsSpiritualSupport] = useState(false);
  const [hasObservances, setHasObservances] = useState(false);
  const [preferredSupport, setPreferredSupport] = useState("");
  const [isWorkingOnNeeds, setIsWorkingOnNeeds] = useState(false);
  const [hasBarriers, setHasBarriers] = useState(false);
  const [wantsCaseMgmt, setWantsCaseMgmt] = useState(false);
  // aggregate progress reported by each Section (keyed by Section title)

  const {
    totalCompleted,
    totalRequired,
    pctAll,
    allComplete,
    fieldsIncomplete,
    sectionsIncomplete,
    incompleteList, // optional if you want to show which sections & how many left
  } = React.useMemo(() => {
    const entries = Object.entries(sectionProgress); // [title, {completed,total}]
    const totals = entries.reduce(
      (acc, [, v]) => {
        acc.done += v.completed;
        acc.req += v.total;
        if (v.total > 0 && v.completed < v.total) {
          acc.sectionsLeft += 1;
        }
        return acc;
      },
      { done: 0, req: 0, sectionsLeft: 0 }
    );

    const list = entries
      .filter(([, v]) => v.total > 0 && v.completed < v.total)
      .map(([title, v]) => ({ title, remaining: v.total - v.completed }));

    return {
      totalCompleted: totals.done,
      totalRequired: totals.req,
      pctAll:
        totals.req === 0 ? 0 : Math.round((totals.done / totals.req) * 100),
      allComplete: totals.req > 0 && totals.done === totals.req,
      fieldsIncomplete: Math.max(0, totals.req - totals.done),
      sectionsIncomplete: totals.sectionsLeft,
      incompleteList: list,
    };
  }, [sectionProgress]);

  // you already have:
  /// const [servicesOtherChecked, setServicesOtherChecked] = useState(false);

  // Income multi-select: show only selected sources
  const incomeOptions = [
    { id: "ssdi", label: "SSDI" },
    { id: "ssi", label: "SSI" },
    { id: "afdc", label: "AFDC" },
    { id: "employment", label: "Employment" },
    { id: "foodStamps", label: "Food Stamps" },
    { id: "childSupport", label: "Child Support" },
    { id: "unemployment", label: "Unemployment" },
    { id: "spousalSupport", label: "Spousal Support" },
    { id: "otherIncome", label: "Other" },
  ];
  const [selectedIncome, setSelectedIncome] = useState<string[]>([]);

  const drugs = useMemo(
    () => [
      "Alcohol",
      "Heroin",
      "Marijuana / Hashish",
      "Cocaine (powder)",
      "Crack cocaine",
      "Amphetamines / Methamphetamines",
      "Barbiturates",
      "Benzodiazepines",
      "Ecstasy (MDMA)",
      "GHB",
      "Hallucinogens (LSD)",
      "Hallucinogens (PCP)",
      "Hallucinogens (Other)",
      "Inhalants",
      "Ketamine",
      "Methadone (non‑RX)",
      "Opiates (other)",
      "Oxycontin",
      "Rohypnol",
    ],
    []
  );

  return (
    <main className="mx-auto p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">
          NLRC Intake Application — Single Page
        </h1>
        <div className="sticky top-0 z-20 -mx-6 mb-4 bg-white/85 backdrop-blur border-b px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-[width]"
                style={{ width: `${pctAll}%` }}
              />
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-700 whitespace-nowrap">
                {totalCompleted}/{totalRequired} complete
              </div>
              {!allComplete && (
                <div className="text-[11px] text-gray-600 whitespace-nowrap">
                  {fieldsIncomplete} items · {sectionsIncomplete} sections left
                </div>
              )}
              {!allComplete && incompleteList.length > 0 && (
                <details className="ml-2 text-xs text-gray-700">
                  <summary className="cursor-pointer select-none">View</summary>
                  <ul className="mt-1 space-y-0.5 max-h-40 overflow-auto pr-1">
                    {incompleteList.map(({ title, remaining }) => (
                      <li key={title} className="truncate">
                        <span className="font-medium">{title}:</span>{" "}
                        {remaining} left
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 1) Applicant Information */}
      <Section
        title="1) Applicant Information"
        onProgress={progressCB("1) Applicant Information")}
        summary={"Personal Info for the Applicant"}
        initiallyOpen
      >
        {/* Name + Sex on one line */}
        <Grid cols={4} distribute="between">
          <Input id="firstName" label="First Name" required={true} />
          <Input id="middleInitial" label="Middle Initial" />
          <Input id="lastName" label="Last Name" required={true} />
          <Select id="gender" label="Sex" required={true}>
            <option value="">Select…</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other / Prefer not to say</option>
          </Select>
        </Grid>

        {/* DOB, SSN, Marital Status, Race/Ethnicity, Language on one line */}
        <Grid cols={4} distribute="between">
          <Input id="dob" label="Date of Birth" type="date" required={true} />
          <Input
            id="ssn"
            label="SSN"
            placeholder="123-45-6789"
            required={true}
          />
          <Select id="maritalStatus" label="Marital Status" required={true}>
            <option value="">Select…</option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Separated</option>
            <option>Widowed</option>
          </Select>
          <Input id="raceEthnicity" label="Race / Ethnicity" required={true} />
        </Grid>

        {/* Contact details condensed */}
        <Grid cols={4} distribute="between">
          <Input
            id="language"
            label="Primary Language"
            placeholder="English / Spanish / Other"
            required={true}
          />
          <Input id="phoneHome" label="Phone (Home)" required={true} />
          <Input id="phoneWork" label="Phone (Work)" />
          <Input id="email" label="Email (optional)" type="email" />
        </Grid>

        {/* Emergency contact condensed */}
        <Grid cols={4} distribute="between">
          <Input
            id="emergencyContact"
            label="Emergency Contact (Name)"
            required={true}
          />
          <Input
            id="emergencyPhone"
            label="Emergency Contact (Phone)"
            required={true}
          />
          <Input id="emergencyRelation" label="Relation" required={true} />
          <div className="space-y-2">
            <ToggleRow
              id="veteran"
              label="Are you a veteran?"
              value={veteran}
              onChange={setVeteran}
            />
            {veteran && (
              <Input id="branch" label="What branch?" required={true} />
            )}
          </div>
        </Grid>

        {/* Veteran toggle → reveals branch */}
      </Section>

      {/* 2) Address & Referral */}
      <Section
        title="2) Address & Referral"
        onProgress={progressCB("2) Address & Referral")}
        summary={"Where do you currently live / receive mail?"}
      >
        <Grid cols={2}>
          <Select
            id="preAdmission"
            label="Current living situation"
            className="col-span-2"
            value={preAdmission}
            onChange={(e) => setPreAdmission(e.target.value)}
            required={true}
          >
            <option value="">Select…</option>
            <option>Homeless shelter</option>
            <option>Unhomed</option>
            <option>Dependent living / institution</option>
            <option>Independent living</option>
            <option>Treatment center</option>
            <option>Prison</option>
          </Select>

          {/* Address fields only for situations that typically have an address */}
          {(preAdmission === "Homeless shelter" ||
            preAdmission === "Dependent living / institution" ||
            preAdmission === "Independent living") && (
            <>
              <Input
                id="street"
                label="Street"
                className="col-span-2"
                required={true}
              />
              <Input id="city" label="City" required={true} />
              <Input id="state" label="State" required={true} />
              <Input id="zip" label="Zip" required={true} />
              <Input
                id="proofType"
                label="Proof of Address (type)"
                required={true}
              />
            </>
          )}

          {/* Sensitive: for unhomed, ask for a brief summary instead of address */}
          {preAdmission === "Unhomed" && (
            <Textarea
              id="unhomedSummary"
              label="Tell us about your current situation (in your own words)"
              className="col-span-2"
              required={true}
            />
          )}

          {/* Facility name for treatment centers or prison */}
          {(preAdmission === "Treatment center" ||
            preAdmission === "Prison") && (
            <Input
              id="facilityName"
              label="Facility name"
              className="col-span-2"
              required={true}
            />
          )}

          <Input
            id="referralSource"
            label="How did you hear about NLRC?"
            className="col-span-2"
            required={true}
          />
        </Grid>
      </Section>

      {/* 3) Household Members */}
      <Section
        title="3) Household Members"
        onProgress={progressCB("3) Household Members")}
        summary={"Who lives with you (optional)?"}
      >
        <ToggleRow
          id="hasHouseholdMembers"
          label="Are there other people living in the household?"
          value={hasHouseholdMembers}
          onChange={setHasHouseholdMembers}
        />
        {hasHouseholdMembers && (
          <Repeater caption="Add household member (Name, SSN, DOB, Relationship)">
            <Grid cols={4}>
              <Input label="Name" required={true} />
              <Input label="SSN" />
              <Input label="DOB" type="date" required={true} />
              <Input label="Relationship" required={true} />
            </Grid>
          </Repeater>
        )}
      </Section>

      <Section
        title="4) Income & Benefits"
        onProgress={progressCB("4) Income & Benefits")}
        summary={"Information related to your income and other benefits"}
      >
        {/* Virtual required item: at least one income source */}
        <Requirement id="income-source" filled={selectedIncome.length > 0} />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">
            Select your income sources
          </span>

          <div className="flex gap-3">
            {/* Available (left) */}
            <div className="flex-1">
              <label className="block mb-1 text-xs text-gray-500">
                Available
              </label>
              <select
                aria-label="Available income sources"
                multiple
                size={8}
                className="w-full rounded-md border px-3 py-2"
                value={leftPick}
                onChange={(e) =>
                  setLeftPick(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
              >
                {incomeOptions
                  .filter((o) => !selectedIncome.includes(o.id))
                  .map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* Middle controls */}
            <div className="flex flex-col items-center justify-center gap-2">
              <button
                type="button"
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                disabled={leftPick.length === 0}
                onClick={() => {
                  const next = Array.from(
                    new Set([...selectedIncome, ...leftPick])
                  );
                  setSelectedIncome(next);
                  setLeftPick([]);
                }}
              >
                →
              </button>
              <button
                type="button"
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                disabled={rightPick.length === 0}
                onClick={() => {
                  const next = selectedIncome.filter(
                    (id) => !rightPick.includes(id)
                  );
                  setSelectedIncome(next);
                  setRightPick([]);
                }}
              >
                ←
              </button>
            </div>

            {/* Selected (right) */}
            <div className="flex-1">
              <label className="block mb-1 text-xs text-gray-500">
                Selected
              </label>
              <select
                aria-label="Selected income sources"
                multiple
                size={8}
                className={`w-full rounded-md border px-3 py-2 ${
                  selectedIncome.length === 0 ? "border-red-500" : ""
                }`}
                value={rightPick}
                onChange={(e) =>
                  setRightPick(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
              >
                {selectedIncome.map((id) => {
                  const opt = incomeOptions.find((o) => o.id === id);
                  return (
                    <option key={id} value={id}>
                      {opt?.label ?? id}
                    </option>
                  );
                })}
              </select>
              {selectedIncome.length === 0 && (
                <p className="mt-1 text-xs text-red-600">
                  Please select at least one income source.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Amount fields (mark required) */}
        {selectedIncome.length > 0 && (
          <Grid cols={4}>
            {selectedIncome.includes("ssdi") && (
              <Currency id="ssdi" label="SSDI ($/mo)" required />
            )}
            {selectedIncome.includes("ssi") && (
              <Currency id="ssi" label="SSI ($/mo)" required />
            )}
            {selectedIncome.includes("afdc") && (
              <Currency id="afdc" label="AFDC ($/mo)" required />
            )}
            {selectedIncome.includes("employment") && (
              <Currency id="employment" label="Employment ($/mo)" required />
            )}
            {selectedIncome.includes("foodStamps") && (
              <Currency id="foodStamps" label="Food Stamps ($/mo)" required />
            )}
            {selectedIncome.includes("childSupport") && (
              <Currency
                id="childSupport"
                label="Child Support ($/mo)"
                required
              />
            )}
            {selectedIncome.includes("unemployment") && (
              <Currency
                id="unemployment"
                label="Unemployment ($/mo)"
                required
              />
            )}
            {selectedIncome.includes("spousalSupport") && (
              <Currency
                id="spousalSupport"
                label="Spousal Support ($/mo)"
                required
              />
            )}
            {selectedIncome.includes("otherIncome") && (
              <>
                <Input
                  id="otherIncomeDesc"
                  label="Other income (describe)"
                  className="col-span-2"
                  required
                />
                <Currency
                  id="otherIncomeAmt"
                  label="Other ($/mo)"
                  className="col-span-2"
                  required
                />
              </>
            )}
          </Grid>
        )}
      </Section>
      {/* 5) Insurance */}
      <Section
        title="5) Insurance"
        onProgress={progressCB("5) Insurance")}
        summary={"Medical insurance information"}
      >
        <ToggleRow
          id="hasInsurance"
          label="Do you have medical insurance?"
          value={hasInsurance}
          onChange={setHasInsurance}
        />

        {hasInsurance && (
          <>
            {/* Virtual requirement: at least one carrier selected */}
            <Requirement
              id="insurance-carrier"
              filled={
                insVAChecked ||
                insMedicaidChecked ||
                insMedicareChecked ||
                insOtherChecked
              }
            />

            {/* Carrier selectors */}
            <div className="rounded-lg border p-3">
              <span className="mb-2 block text-xs text-gray-500">
                Select all that apply
              </span>
              <Grid cols={4}>
                <CheckboxRow
                  id="insVA"
                  label="VA"
                  value={insVAChecked}
                  onChange={setInsVAChecked}
                />
                <CheckboxRow
                  id="insMedicaid"
                  label="Medicaid"
                  value={insMedicaidChecked}
                  onChange={setInsMedicaidChecked}
                />
                <CheckboxRow
                  id="insMedicare"
                  label="Medicare"
                  value={insMedicareChecked}
                  onChange={setInsMedicareChecked}
                />
                <CheckboxRow
                  id="insOther"
                  label="Other"
                  value={insOtherChecked}
                  onChange={setInsOtherChecked}
                />
              </Grid>

              {/* Helper if none chosen */}
              {!(
                insVAChecked ||
                insMedicaidChecked ||
                insMedicareChecked ||
                insOtherChecked
              ) && (
                <p className="mt-2 text-xs text-red-600">
                  Select at least one insurance type.
                </p>
              )}
            </div>

            {/* Carrier-specific details (only required when toggled) */}
            <Grid cols={3} className="mt-3">
              {/* VA */}
              {insVAChecked && (
                <>
                  <Input id="vaId" label="VA Member ID #" required />
                  <Input id="vaFacility" label="VA Facility / Clinic" />
                  <Input id="vaPhone" label="VA Contact Phone" />
                </>
              )}

              {/* Medicaid */}
              {insMedicaidChecked && (
                <Input id="medicaidId" label="Medicaid ID #" required />
              )}

              {/* Medicare */}
              {insMedicareChecked && (
                <Input id="medicareId" label="Medicare ID #" required />
              )}

              {/* Other */}
              {insOtherChecked && (
                <>
                  {/* Carrier & plan */}
                  <Input
                    id="otherInsCarrier"
                    label="Other Insurance (carrier name)"
                    className="col-span-2"
                    required
                  />
                  <Input id="otherInsPlan" label="Plan name" />

                  {/* Member identifiers */}
                  <Input
                    id="otherInsPolicyId"
                    label="Policy / Member ID #"
                    required
                  />
                  <Input id="otherInsGroup" label="Group #" />

                  {/* Pharmacy identifiers (optional, if applicable) */}
                  <Input id="otherInsRxBin" label="Rx BIN (if applicable)" />
                  <Input id="otherInsRxPcn" label="Rx PCN (if applicable)" />

                  {/* Carrier contact */}
                  <Input id="otherInsPhone" label="Carrier phone" />

                  {/* Subscriber details */}
                  <Input
                    id="otherInsSubscriber"
                    label="Subscriber name"
                    className="col-span-2"
                  />
                  <Select
                    id="otherInsRelationship"
                    label="Relationship to applicant"
                  >
                    <option value="">Select…</option>
                    <option>Self</option>
                    <option>Spouse</option>
                    <option>Parent/Guardian</option>
                    <option>Child</option>
                    <option>Other</option>
                  </Select>
                  <Input
                    id="otherInsSubscriberDob"
                    label="Subscriber DOB"
                    type="date"
                  />

                  {/* Employer plan (optional) */}
                  <Input
                    id="otherInsEmployer"
                    label="Employer (if employer plan)"
                    className="col-span-2"
                  />
                </>
              )}
            </Grid>
          </>
        )}
      </Section>

      {/* 6) Health Data */}
      <Section
        title="6) Health Data"
        onProgress={progressCB("6) Health Data")}
        summary={"Info we need to help manage health"}
      >
        <Grid cols={3}>
          {/* Always required: overall health rating */}
          <Select id="healthRating" label="Rate your health" required>
            <option value="">Select…</option>
            <option>Very good</option>
            <option>Good</option>
            <option>Average</option>
            <option>Declining</option>
          </Select>

          {/* Gate: illnesses/injuries/handicaps */}
          <ToggleRow
            id="hasHealthIssues"
            label="Any illnesses, injuries, or handicaps?"
            value={hasHealthIssues}
            onChange={setHasHealthIssues}
          />

          {/* Optional date (not required unless you want to enforce it) */}
          <Input
            id="lastExamDate"
            label="Date of last medical examination"
            type="date"
          />
        </Grid>

        {/* Details required only when issues are present */}
        {hasHealthIssues && (
          <Textarea
            id="illnessInjury"
            label="List illnesses / injuries / handicaps"
            required
          />
        )}

        {/* Gate: allergies */}
        <ToggleRow
          id="hasAllergies"
          label="Any allergies?"
          value={hasAllergiesToggle}
          onChange={setHasAllergiesToggle}
        />
        {hasAllergiesToggle && (
          <Input id="allergies" label="Allergies (list)" required />
        )}

        {/* Gate: primary care provider info */}
        <ToggleRow
          id="hasPrimaryCare"
          label="Do you have a primary care provider?"
          value={hasPrimaryCare}
          onChange={setHasPrimaryCare}
        />
        {hasPrimaryCare && (
          <Grid cols={3}>
            <Input id="pcpName" label="Provider name" required />
            <Input id="pcpClinic" label="Clinic / Practice" />
            <Input id="pcpPhone" label="Phone" />
          </Grid>
        )}

        {/* Gate: exam results text (optional to include) */}
        <ToggleRow
          id="hasExamResults"
          label="Would you like to include exam results?"
          value={hasExamResultsToggle}
          onChange={setHasExamResultsToggle}
        />
        {hasExamResultsToggle && (
          <Textarea id="examResults" label="Exam results" required />
        )}
      </Section>

      {/* 7) Hospitalizations */}
      <Section
        title="7) Hospitalizations (incl. psych, rehab, detox)"
        onProgress={progressCB(
          "7) Hospitalizations (incl. psych, rehab, detox)"
        )}
        summary={"Information about any form of hospitalization"}
      >
        <ToggleRow
          id="hasHospitalizations"
          label="Any hospitalizations?"
          value={hasHospitalizations}
          onChange={setHasHospitalizations}
        />
        {hasHospitalizations && (
          <Repeater caption="Add hospitalization (Hospital, Dates, Reason)">
            <Grid cols={3}>
              <Input label="Hospital Name" required />
              <Input
                label="Dates"
                placeholder="e.g., 06/2023–07/2023"
                required
              />
              <Input label="Reason" required />
            </Grid>
          </Repeater>
        )}
      </Section>

      {/* 8) Medications */}
      <Section
        title="8) Medications (current)"
        onProgress={progressCB("8) Medications (current)")}
        summary={"Medication information for administration and dispensing"}
      >
        <ToggleRow
          id="hasMedications"
          label="Are you currently taking medications?"
          value={hasMedications}
          onChange={setHasMedications}
        />
        {hasMedications && (
          <Repeater caption="Add medication (Name, Dosage, Prescribing Doctor)">
            <Grid cols={3}>
              <Input label="Medication" required />
              <Input label="Dosage" required />
              <Input label="Prescribing Doctor" required />
            </Grid>
          </Repeater>
        )}
      </Section>

      {/* 9) Judicial History */}
      <Section
        title="9) Judicial History"
        onProgress={progressCB("9) Judicial History")}
        summary={"Information about your criminal history"}
      >
        {/* Past convictions (gate) */}
        <ToggleRow
          id="hasConvictions"
          label="Have you ever been convicted of a crime?"
          value={hasConvictions}
          onChange={setHasConvictions}
        />
        {hasConvictions && (
          <Repeater caption="Convictions (please add each conviction)">
            <Grid cols={3}>
              <Input label="Offense / Charge" required />
              <Input label="Jurisdiction (City/State)" />
              <Input label="Case / Docket #" />
              <Input label="Conviction Date" type="date" required />
              <Input label="Sentence / Disposition" required />
              <Input label="Time served (if applicable)" />
            </Grid>
          </Repeater>
        )}

        {/* Current supervision (gate) */}
        <ToggleRow
          id="onProbationParole"
          label="Are you currently on probation or parole?"
          value={onProbationParole}
          onChange={setOnProbationParole}
        />
        {onProbationParole && (
          <Grid cols={3}>
            <Input label="Supervising Agency / Office" required />
            <Input label="Officer Name" required />
            <Input label="Officer Phone" required />
            <Input label="Officer Email" type="email" />
            <Select label="Supervision Type" required>
              <option value="">Select…</option>
              <option>Probation</option>
              <option>Parole</option>
              <option>Other</option>
            </Select>
            <Input label="Supervision Level (e.g., high/med/low)" />
            <Input label="Start Date" type="date" />
            <Input label="End Date (if known)" type="date" />
            <Input label="Reporting Frequency (e.g., weekly)" />
          </Grid>
        )}

        {/* Pending/open cases (gate) */}
        <ToggleRow
          id="hasPendingCases"
          label="Do you have any pending charges or open court cases?"
          value={hasPendingCases}
          onChange={setHasPendingCases}
        />
        {hasPendingCases && (
          <Repeater caption="Pending case(s)">
            <Grid cols={3}>
              <Input label="Offense / Charge" required />
              <Input label="Jurisdiction (City/State)" />
              <Input label="Case / Docket #" />
              <Input label="Next Court Date" type="date" required />
              <Input label="Attorney / Public Defender" />
              <Textarea label="Notes (e.g., conditions, no-contact)" />
            </Grid>
          </Repeater>
        )}

        {/* Protection / restraining orders (gate) */}
        <ToggleRow
          id="hasRestrainingOrders"
          label="Do you have any active protection or restraining orders?"
          value={hasRestrainingOrders}
          onChange={setHasRestrainingOrders}
        />
        {hasRestrainingOrders && (
          <Grid cols={3}>
            <Input label="Order Type (e.g., PFA)" required />
            <Input label="Protected Party (name)" required />
            <Input label="Jurisdiction (City/State)" />
            <Input label="Case / Docket #" />
            <Input label="Expiration Date" type="date" />
          </Grid>
        )}

        {/* Sex offender registry (gate) */}
        <ToggleRow
          id="isRegisteredSO"
          label="Are you required to register as a sex offender?"
          value={isRegisteredSO}
          onChange={setIsRegisteredSO}
        />
        {isRegisteredSO && (
          <Grid cols={3}>
            <Input label="Registration State" required />
            <Select label="Tier / Level" required>
              <option value="">Select…</option>
              <option>Level 1</option>
              <option>Level 2</option>
              <option>Level 3</option>
              <option>Tier I</option>
              <option>Tier II</option>
              <option>Tier III</option>
            </Select>
            <Input label="Registration End Date (if known)" type="date" />
          </Grid>
        )}

        {/* Court-mandated placement (gate) */}
        <ToggleRow
          id="isCourtMandated"
          label="Is your placement at NLRC court-mandated?"
          value={isCourtMandated}
          onChange={setIsCourtMandated}
        />
        {isCourtMandated && (
          <Grid cols={3}>
            <Input label="Court Name" required />
            <Input label="Case / Docket #" required />
            <Input label="Judge / Magistrate" />
            <Textarea
              label="Required program terms (curfew, treatment, etc.)"
              required
            />
            <Input label="Reporting Schedule (e.g., monthly)" />
          </Grid>
        )}

        {/* Financial obligations (gate) */}
        <ToggleRow
          id="hasFinesRestitution"
          label="Do you have outstanding fines, fees, or restitution?"
          value={hasFinesRestitution}
          onChange={setHasFinesRestitution}
        />
        {hasFinesRestitution && (
          <Grid cols={3}>
            <Currency label="Total Outstanding ($)" required />
            <Input label="Payee / Agency" />
            <Input label="Due Date (if known)" type="date" />
          </Grid>
        )}

        {/* Release / technology restrictions (gates) */}
        <ToggleRow
          id="hasReleaseConditions"
          label="Do you have conditions of release or supervision constraints?"
          value={hasReleaseConditions}
          onChange={setHasReleaseConditions}
        />
        {hasReleaseConditions && (
          <Textarea
            label="List conditions (e.g., curfew, travel, no-contact)"
            required
          />
        )}

        <ToggleRow
          id="hasTechRestrictions"
          label="Any technology or device restrictions?"
          value={hasTechRestrictions}
          onChange={setHasTechRestrictions}
        />
        {hasTechRestrictions && (
          <Textarea label="Describe device / internet restrictions" required />
        )}

        {/* Safety check (gate) */}
        <ToggleRow
          id="selfHarmHistory"
          label="Have you ever attempted to harm yourself?"
          value={selfHarmHistory}
          onChange={setSelfHarmHistory}
        />
        {selfHarmHistory && <Textarea label="Please explain" required />}
      </Section>

      {/* 10) Services Needed */}
      <Section
        title="10) Services Needed"
        onProgress={progressCB("10) Services Needed")}
        summary={
          "NLRC offers a wide range of services, please check all that interest you"
        }
      >
        <ToggleRow
          id="needsServices"
          label="Do you need services?"
          value={needsServices}
          onChange={setNeedsServices}
        />

        {needsServices && (
          <>
            {/* Virtual requirement: at least one service selected */}
            <Requirement
              id="services-selected"
              filled={
                svcHousing ||
                svcMoneyMgmt ||
                svcRecreation ||
                svcLegal ||
                svcEntitlements ||
                svcHealthcare ||
                svcFamily ||
                svcVocational ||
                svcTreatment ||
                servicesOtherChecked
              }
            />

            {/* Service checkboxes */}
            <div className="rounded-lg border p-3">
              <span className="mb-2 block text-xs text-gray-500">
                Select all that apply
              </span>
              <Grid cols={3}>
                <CheckboxRow
                  label="Housing assistance"
                  value={svcHousing}
                  onChange={setSvcHousing}
                />
                <CheckboxRow
                  label="Money management"
                  value={svcMoneyMgmt}
                  onChange={setSvcMoneyMgmt}
                />
                <CheckboxRow
                  label="Recreation / socialization"
                  value={svcRecreation}
                  onChange={setSvcRecreation}
                />
                <CheckboxRow
                  label="Legal assistance"
                  value={svcLegal}
                  onChange={setSvcLegal}
                />
                <CheckboxRow
                  label="Obtain entitlements"
                  value={svcEntitlements}
                  onChange={setSvcEntitlements}
                />
                <CheckboxRow
                  label="Healthcare coordination"
                  value={svcHealthcare}
                  onChange={setSvcHealthcare}
                />
                <CheckboxRow
                  label="Family support"
                  value={svcFamily}
                  onChange={setSvcFamily}
                />
                <CheckboxRow
                  label="Vocational support"
                  value={svcVocational}
                  onChange={setSvcVocational}
                />
                <CheckboxRow
                  label="Drug / alcohol treatment"
                  value={svcTreatment}
                  onChange={setSvcTreatment}
                />
                <CheckboxRow
                  label="Other"
                  value={servicesOtherChecked}
                  onChange={setServicesOtherChecked}
                />
              </Grid>

              {/* Helper if none chosen */}
              {!(
                svcHousing ||
                svcMoneyMgmt ||
                svcRecreation ||
                svcLegal ||
                svcEntitlements ||
                svcHealthcare ||
                svcFamily ||
                svcVocational ||
                svcTreatment ||
                servicesOtherChecked
              ) && (
                <p className="mt-2 text-xs text-red-600">
                  Select at least one service.
                </p>
              )}
            </div>

            {/* Follow-ups (minimal + required only where it matters) */}
            <div className="mt-3 space-y-4">
              {/* Housing assistance */}
              {svcHousing && (
                <Grid cols={3}>
                  <Input label="Primary housing need" required />
                  <Input
                    label="Desired move-in timeframe"
                    placeholder="e.g., within 30 days"
                  />
                  <Input label="Accessibility needs (if any)" />
                </Grid>
              )}

              {/* Money management */}
              {svcMoneyMgmt && (
                <Grid cols={3}>
                  <Input
                    label="Primary money goal"
                    placeholder="e.g., budgeting, rent tracking"
                    required
                  />
                  <Input
                    label="Pay schedule preference (optional)"
                    placeholder="e.g., weekly, biweekly"
                  />
                </Grid>
              )}

              {/* Recreation / socialization (no requireds; keep it light) */}
              {svcRecreation && (
                <Textarea
                  label="Interests / activities you enjoy"
                  placeholder="e.g., walking group, crafts, sports"
                />
              )}

              {/* Legal assistance */}
              {svcLegal && (
                <Grid cols={3}>
                  <Select label="Legal matter type">
                    <option value="">Select…</option>
                    <option>Benefits</option>
                    <option>Records/expungement</option>
                    <option>Family</option>
                    <option>Housing</option>
                    <option>Other</option>
                  </Select>
                  <Input label="Next important date (if any)" type="date" />
                  <Input label="Attorney / PD (if any)" />
                  <Textarea
                    label="Brief description of legal concern"
                    required
                  />
                </Grid>
              )}

              {/* Obtain entitlements */}
              {svcEntitlements && (
                <Grid cols={3}>
                  <Input
                    label="Programs to pursue"
                    placeholder="e.g., SNAP, SSI/SSDI, Medicaid"
                    required
                  />
                  <Select label="Applied before?">
                    <option value="">Select…</option>
                    <option>Yes</option>
                    <option>No</option>
                  </Select>
                  <Input label="If yes, status (optional)" />
                </Grid>
              )}

              {/* Healthcare coordination */}
              {svcHealthcare && (
                <Grid cols={3}>
                  <Input
                    label="Primary coordination need"
                    placeholder="e.g., appointments, referrals, medications"
                    required
                  />
                  <Input label="Preferred clinic/provider (optional)" />
                  <Input label="Best times for appointments (optional)" />
                </Grid>
              )}

              {/* Family support */}
              {svcFamily && (
                <Grid cols={3}>
                  <Input
                    label="Primary family goal"
                    placeholder="e.g., reunification, visitation, communication"
                    required
                  />
                  <Input label="Key contact(s) (optional)" />
                  <Input label="Scheduling constraints (optional)" />
                </Grid>
              )}

              {/* Vocational support */}
              {svcVocational && (
                <Grid cols={3}>
                  <Input
                    label="Work goal"
                    placeholder="e.g., part-time warehouse, maintenance"
                    required
                  />
                  <Input label="Experience / certifications (optional)" />
                  <Input label="Schedule constraints (optional)" />
                </Grid>
              )}

              {/* Drug / alcohol treatment */}
              {svcTreatment && (
                <Grid cols={3}>
                  <Select label="Treatment interest" required>
                    <option value="">Select…</option>
                    <option>Outpatient program</option>
                    <option>Inpatient / residential</option>
                    <option>Support group</option>
                    <option>Medication-assisted treatment</option>
                  </Select>
                  <Input label="Current provider (if any)" />
                  <Input label="Preferred program (optional)" />
                </Grid>
              )}

              {/* Other */}
              {servicesOtherChecked && (
                <Grid cols={3}>
                  <Input label="Describe the service needed" required />
                  <Textarea label="Anything else we should know? (optional)" />
                </Grid>
              )}
            </div>
          </>
        )}
      </Section>

      {/* 11) Personal / Family Background */}
      <Section
        title="11) Personal / Family Background"
        onProgress={progressCB("11) Personal / Family Background")}
        summary={"Information about your upbringing and relationships"}
      >
        <Grid cols={2}>
          {/* Growing up relationships — now include “Absent” and are required */}
          <Select
            label="Relationship growing up — Father"
            value={relFatherUp}
            onChange={(e) => setRelFatherUp(e.target.value)}
            required
          >
            <option value="">Select…</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
            <option>Absent</option>
          </Select>

          <Select label="Relationship now — Father">
            <option value="">Select…</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
            <option>No contact</option>
            <option>Deceased</option>
          </Select>

          <Select
            label="Relationship growing up — Mother"
            value={relMotherUp}
            onChange={(e) => setRelMotherUp(e.target.value)}
            required
          >
            <option value="">Select…</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
            <option>Absent</option>
          </Select>

          <Select label="Relationship now — Mother">
            <option value="">Select…</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
            <option>No contact</option>
            <option>Deceased</option>
          </Select>
          {/* Home life overall */}
          <Select label="Home life while growing up" required>
            <option value="">Select…</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
            <option>Unstable</option>
          </Select>

          {/* Show only if BOTH growing-up relationships were Absent */}
          {relFatherUp === "Absent" && relMotherUp === "Absent" && (
            <Input
              id="raisedBy"
              label="Raised by (who?)"
              required
              className="col-span-1"
            />
          )}
          <Input label="# of Brothers" type="number" />
          <Input label="# of Sisters" type="number" />

          <Textarea label="Comments" className="col-span-2" />
        </Grid>
      </Section>

      {/* 12) Education */}
      <Section
        title="12) Education"
        onProgress={progressCB("12) Education")}
        summary={"Information about your educational background"}
      >
        <ToggleRow
          id="hasEducation"
          label="Do you have any education history?"
          value={hasEducation}
          onChange={setHasEducation}
        />

        {hasEducation && (
          <Repeater caption="Add education (type, institution, dates, award)">
            <EducationEntry />
          </Repeater>
        )}
      </Section>

      {/* 13) Work History */}
      <Section
        title="13) Work History"
        onProgress={progressCB("13) Work History")}
        summary={"Information about your employment history"}
      >
        <ToggleRow
          id="hasEmployment"
          label="Do you have employment history?"
          value={hasEmployment}
          onChange={setHasEmployment}
        />

        {hasEmployment && (
          <Repeater caption="Add employer">
            <EmploymentEntry />
          </Repeater>
        )}
      </Section>

      {/* 14) Drug & Alcohol Use */}
      <Section
        title="14) Drug & Alcohol Use"
        onProgress={progressCB("14) Drug & Alcohol Use")}
        summary={"Information about your drug and alcohol use"}
      >
        <ToggleRow
          id="hasSubstanceUse"
          label="Have you ever used any illegal or illicit substances?"
          value={hasSubstanceUse}
          onChange={setHasSubstanceUse}
        />

        {hasSubstanceUse && (
          <>
            {/* Require at least one substance if the section is active */}
            <Requirement
              id="substances-selected"
              filled={selectedSubstances.length > 0}
            />

            {/* Substance checklist (controlled) */}
            <Grid cols={4}>
              {drugs.map((d) => {
                const checked = selectedSubstances.includes(d);
                return (
                  <CheckboxRow
                    key={d}
                    label={d}
                    value={checked}
                    onChange={(v) =>
                      setSelectedSubstances((prev) =>
                        v ? [...prev, d] : prev.filter((x) => x !== d)
                      )
                    }
                  />
                );
              })}
            </Grid>

            {/* Minimal required follow-ups only when at least one is selected */}
            {selectedSubstances.length > 0 && (
              <>
                <Grid cols={4} className="mt-3">
                  <Select
                    id="primarySubstance"
                    label="Primary substance"
                    value={primarySubstance}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setPrimarySubstance(e.target.value)
                    }
                    required
                  >
                    <option value="">Select…</option>
                    {selectedSubstances.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>

                  <Input
                    id="ageFirstUse"
                    label="Age of first use"
                    type="number"
                    required
                  />

                  <ToggleRow
                    id="isAbstinent"
                    label="Currently abstinent?"
                    value={isAbstinent}
                    onChange={setIsAbstinent}
                  />

                  {isAbstinent ? (
                    <Input
                      id="sobrietyDate"
                      label="Sobriety start date"
                      type="date"
                      required
                    />
                  ) : (
                    <Input
                      id="lastUseDate"
                      label="Date of last use"
                      type="date"
                      required
                    />
                  )}
                </Grid>

                {/* Treatment history (optional gate) */}
                <ToggleRow
                  id="hadTreatment"
                  label="Have you had substance use treatment?"
                  value={hadTreatment}
                  onChange={setHadTreatment}
                />

                {hadTreatment && (
                  <Repeater caption="Add treatment episode">
                    <Grid cols={4}>
                      <Select label="Program type" required>
                        <option value="">Select…</option>
                        <option>Outpatient</option>
                        <option>Inpatient / Residential</option>
                        <option>Detox</option>
                        <option>Support group</option>
                      </Select>
                      <Input label="Program / Provider" required />
                      <Input label="Start date" type="date" required />
                      <Input label="End date" type="date" />
                      <Select label="Completed?">
                        <option value="">Select…</option>
                        <option>Yes</option>
                        <option>No</option>
                      </Select>
                      <Textarea
                        label="Notes (optional)"
                        className="col-span-4"
                      />
                    </Grid>
                  </Repeater>
                )}

                {/* Light optional narrative */}
                <Textarea
                  id="substanceNarrative"
                  label="Brief history (optional)"
                  placeholder="e.g., drug of choice, any periods of sobriety, helpful supports"
                />
              </>
            )}
          </>
        )}
      </Section>

      {/* 15) Spiritual & Self Assessment (optional) */}
      <Section
        title="15) Spiritual & Self Assessment (optional)"
        onProgress={progressCB("15) Spiritual & Self Assessment (optional)")}
        summary={"Information about your spiritual and self-assessment"}
      >
        <ToggleRow
          id="wantsSpiritualSection"
          label="Include spiritual/self-assessment?"
          value={wantsSpiritualSection}
          onChange={setWantsSpiritualSection}
        />

        {wantsSpiritualSection && (
          <>
            {/* Light reflection — optional */}
            <Grid cols={2}>
              <Input label="What / who is God to you?" />
              <Input label="How often do you think of God?" />
            </Grid>

            {/* Belonging to a faith community */}
            <ToggleRow
              id="belongsFaithCommunity"
              label="Do you belong to a faith community?"
              value={belongsFaithCommunity}
              onChange={setBelongsFaithCommunity}
            />
            {belongsFaithCommunity && (
              <Grid cols={3}>
                <Input label="Community / congregation name" required />
                <Input label="Leader / contact (optional)" />
                <Input label="Contact phone (optional)" />
              </Grid>
            )}

            {/* Help coordinating spiritual support */}
            <ToggleRow
              id="wantsSpiritualSupport"
              label="Would you like NLRC to help coordinate spiritual support?"
              value={wantsSpiritualSupport}
              onChange={setWantsSpiritualSupport}
            />
            {wantsSpiritualSupport && (
              <Grid cols={3}>
                <Select
                  label="Preferred support"
                  value={preferredSupport}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setPreferredSupport(e.target.value)
                  }
                  required
                >
                  <option value="">Select…</option>
                  <option>Chaplain / pastoral visit</option>
                  <option>Referral to a faith leader</option>
                  <option>Peer support / group</option>
                  <option>Prayer / encouragement</option>
                  <option>Other</option>
                </Select>
                <Input
                  label="Contact preference (phone/email/in-person)"
                  required
                />
                {preferredSupport === "Other" && (
                  <Input label="Describe the support you would like" required />
                )}
              </Grid>
            )}

            {/* Practices / observances we should accommodate */}
            <ToggleRow
              id="hasObservances"
              label="Any religious practices or observances NLRC should accommodate?"
              value={hasObservances}
              onChange={setHasObservances}
            />
            {hasObservances && (
              <Textarea
                label="Describe practices/observances (e.g., dietary needs, prayer times)"
                required
              />
            )}

            {/* Self-assessment (light, a couple required to make the section meaningful) */}
            <Grid cols={2} className="mt-2">
              <Input label="Hobbies" />
              <Input label="Most positive quality" required />
              <Input label="Describe yourself in three words" required />
              <Input label="Three words that disturb you most" />
              <Textarea
                label="If you could do anything in life, what would you do?"
                className="col-span-2"
              />
            </Grid>
          </>
        )}
      </Section>

      {/* 16) Goals & Needs */}
      <Section
        title="16) Goals & Needs"
        onProgress={progressCB("16) Goals & Needs")}
        summary={"Information about your goals and needs"}
      >
        <ToggleRow
          id="hasGoalsNeeds"
          label="Would you like to add goals/needs now?"
          value={hasGoalsNeeds}
          onChange={setHasGoalsNeeds}
        />

        {hasGoalsNeeds && (
          <>
            <Grid cols={2}>
              {/* Core, required to make the section actionable */}
              <Textarea id="currentNeeds" label="Current needs" required />
              <Textarea
                id="immediateGoals"
                label="Immediate goals (next 30–60 days)"
                required
              />

              {/* Optional horizon goals */}
              <Textarea id="goals6m" label="6-month goals" />
              <Textarea id="goals1y" label="1-year goals" />

              {/* What NLRC can do — required */}
              <Textarea
                id="nlrcSupport"
                label="What do you need from NLRC to help meet these?"
                className="col-span-2"
                required
              />
            </Grid>

            {/* Are they already taking steps? */}
            <ToggleRow
              id="isWorkingOnNeeds"
              label="Are you currently working toward these needs/goals?"
              value={isWorkingOnNeeds}
              onChange={setIsWorkingOnNeeds}
            />

            {/* Always show steps if working, then ask about barriers and help either way */}
            {isWorkingOnNeeds && (
              <Textarea
                id="stepsTaken"
                label="What steps are you taking?"
                required
              />
            )}

            {/* Roadblocks */}
            <ToggleRow
              id="hasBarriers"
              label="Are there any barriers getting in the way?"
              value={hasBarriers}
              onChange={setHasBarriers}
            />
            {hasBarriers && (
              <Textarea id="barriers" label="Describe barriers" required />
            )}

            {/* Offer help */}
            <ToggleRow
              id="wantsCaseMgmt"
              label="Would you like help creating an action plan?"
              value={wantsCaseMgmt}
              onChange={setWantsCaseMgmt}
            />
            {wantsCaseMgmt && (
              <Grid cols={2}>
                <Input
                  id="preferredContact"
                  label="Preferred contact method"
                  required
                />
                <Input id="bestTimes" label="Best days/times" />
              </Grid>
            )}
          </>
        )}
      </Section>
      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" className="rounded-md border px-4 py-2">
          Save Draft
        </button>
        <button
          type="button"
          className="rounded-md bg-black text-white px-4 py-2"
        >
          Submit
        </button>
      </div>
    </main>
  );
}

// ========================= Small UI Helpers (wireframe only) =========================
function Section({
  title,
  children,
  initiallyOpen = false,
  summary, // optional summary chips/text when collapsed
  onProgress, // (completed, total) reporter
}: {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
  summary?: React.ReactNode;
  onProgress?: (completed: number, total: number) => void;
}) {
  const [open, setOpen] = React.useState(initiallyOpen);
  const [fields, setFields] = React.useState<
    Record<string, { required: boolean; filled: boolean }>
  >({});

  // progress math
  const completed = Object.values(fields).filter(
    (f) => f.required && f.filled
  ).length;
  const total = Object.values(fields).filter((f) => f.required).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  // report up whenever progress changes
  React.useEffect(() => {
    onProgress?.(completed, total);
  }, [completed, total, onProgress]);

  // per-section progress context
  const ctx = React.useMemo(
    () => ({
      register: (id: string, required: boolean, filled: boolean) =>
        setFields((prev) => ({ ...prev, [id]: { required, filled } })),
      update: (id: string, filled: boolean) =>
        setFields((prev) =>
          prev[id] ? { ...prev, [id]: { ...prev[id], filled } } : prev
        ),
      unregister: (id: string) =>
        setFields((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        }),
    }),
    []
  );

  const panelId = React.useMemo(
    () => `panel-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    [title]
  );

  return (
    <section className="rounded-2xl border shadow-sm bg-white">
      {/* Header */}
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        {/* Left: title + (collapsed) summary */}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold truncate">{title}</h2>
          {!open && summary ? (
            <div className="mt-0.5 text-xs text-gray-500 truncate">
              {summary}
            </div>
          ) : null}
        </div>

        {/* Right: progress + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          {total > 0 && (
            <>
              <div
                className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden"
                aria-label="Section completion"
                title={`${completed}/${total} complete`}
              >
                <div
                  className="h-full bg-green-500 transition-[width]"
                  style={{ width: `${pct}%` }}
                  aria-hidden="true"
                />
              </div>
              {completed < total ? (
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  {completed}/{total} complete
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-green-600 whitespace-nowrap">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0L3.293 9.957a1 1 0 0 1 1.414-1.414l3.04 3.04 6.543-6.543a1 1 0 0 1 1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  All set
                </span>
              )}
            </>
          )}
          <svg
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z" />
          </svg>
        </div>
      </button>

      {/* Body (kept mounted when collapsed so progress stays accurate) */}
      <div id={panelId} className={open ? "block" : "hidden"}>
        <div className="p-5 pt-0 space-y-4">
          <SectionProgressContext.Provider value={ctx}>
            {children}
          </SectionProgressContext.Provider>
        </div>
      </div>
    </section>
  );
}

function Grid({
  cols = 2,
  children,
  className = "",
  distribute = "equal", // default to grid
}: {
  cols?: number;
  children: React.ReactNode;
  className?: string;
  distribute?: "equal" | "between";
}) {
  const kids = React.Children.toArray(children);

  if (distribute === "between") {
    return (
      <div className={`flex flex-wrap justify-between gap-y-3 ${className}`}>
        {kids.map((child, i) => (
          <div key={i} className="basis-0 grow min-w-[12rem]">
            {child}
          </div>
        ))}
      </div>
    );
  }

  const COLS = [
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
    "grid-cols-5",
    "grid-cols-6",
  ];
  const n = Math.max(1, Math.min(6, Math.floor(cols)));
  const colsClass = COLS[n - 1]; // ✅ off-by-one fixed

  return <div className={`grid gap-3 ${colsClass} ${className}`}>{kids}</div>;
}

function Input({
  label,
  id,
  type = "text",
  placeholder = "",
  className = "",
  required = false,
  onChange,
  defaultValue,
  value,
}: {
  label: string;
  id?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  defaultValue?: string | number;
  value?: string | number;
}) {
  const ctx = React.useContext(SectionProgressContext);
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  const ref = React.useRef<HTMLInputElement>(null);

  const computeFilled = React.useCallback(() => {
    const v = ref.current?.value ?? "";
    return String(v).trim().length > 0;
  }, []);

  React.useEffect(() => {
    if (!ctx) return;
    ctx.register(fieldId, !!required, computeFilled());
    return () => ctx.unregister(fieldId);
  }, [ctx, fieldId, required, computeFilled]);

  // reflect external changes for controlled inputs
  React.useEffect(() => {
    if (!ctx) return;
    ctx.update(fieldId, computeFilled());
  }, [value, defaultValue, ctx, fieldId, computeFilled]);

  // only pass one of value/defaultValue to avoid controlled/uncontrolled warnings
  const valueProps =
    value !== undefined
      ? { value }
      : defaultValue !== undefined
      ? { defaultValue }
      : {};

  return (
    <label className={`${className} flex w-full min-w-0 flex-col gap-1`}>
      <span className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        ref={ref}
        id={fieldId}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full min-w-0 rounded-md border px-3 py-2"
        onChange={(e) => {
          ctx?.update(fieldId, computeFilled());
          onChange?.(e);
        }}
        {...valueProps}
      />
    </label>
  );
}

function Textarea({
  label,
  id,
  placeholder = "",
  className = "",
  required = false,
  onChange,
  defaultValue,
  value,
}: {
  label: string;
  id?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  defaultValue?: string;
  value?: string;
}) {
  const ctx = React.useContext(SectionProgressContext);
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  const ref = React.useRef<HTMLTextAreaElement>(null);

  const computeFilled = React.useCallback(() => {
    const v = ref.current?.value ?? "";
    return String(v).trim().length > 0;
  }, []);

  React.useEffect(() => {
    if (!ctx) return;
    ctx.register(fieldId, !!required, computeFilled());
    return () => ctx.unregister(fieldId);
  }, [ctx, fieldId, required, computeFilled]);

  React.useEffect(() => {
    if (!ctx) return;
    ctx.update(fieldId, computeFilled());
  }, [value, defaultValue, ctx, fieldId, computeFilled]);

  const valueProps =
    value !== undefined
      ? { value }
      : defaultValue !== undefined
      ? { defaultValue }
      : {};

  return (
    <label className={`flex w-full min-w-0 flex-col gap-1 ${className}`}>
      <span className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <textarea
        ref={ref}
        id={fieldId}
        placeholder={placeholder}
        required={required}
        className="w-full min-h-[84px] min-w-0 rounded-md border px-3 py-2"
        onChange={(e) => {
          ctx?.update(fieldId, computeFilled());
          onChange?.(e);
        }}
        {...valueProps}
      />
    </label>
  );
}

type SelectProps = {
  label: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
  value?: string | number; // controlled (optional)
  defaultValue?: string | number; // uncontrolled (optional)
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  required?: boolean;
};

function Select(props: SelectProps) {
  const {
    label,
    id,
    children,
    className = "",
    value,
    defaultValue,
    onChange,
    required = false,
  } = props;

  const ctx = React.useContext(SectionProgressContext);
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  const ref = React.useRef<HTMLSelectElement>(null);

  const computeFilled = React.useCallback(() => {
    // prefer the current DOM value; fall back to controlled value if present
    const raw =
      ref.current?.value ?? (value !== undefined ? String(value) : "");
    return raw.trim().length > 0;
  }, [value]);

  React.useEffect(() => {
    if (!ctx) return;
    ctx.register(fieldId, !!required, computeFilled());
    return () => ctx.unregister(fieldId);
  }, [ctx, fieldId, required, computeFilled]);

  React.useEffect(() => {
    if (!ctx) return;
    ctx.update(fieldId, computeFilled());
  }, [value, defaultValue, ctx, fieldId, computeFilled]);

  // Avoid “value as any” and controlled/uncontrolled warnings:
  // build the prop bag imperatively so only ONE of value/defaultValue is passed.
  const valueProps: Partial<
    Pick<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      "value" | "defaultValue"
    >
  > = {};
  if (value !== undefined) {
    valueProps.value = value;
  } else if (defaultValue !== undefined) {
    valueProps.defaultValue = defaultValue;
  }

  return (
    <label className={`flex w-full min-w-0 flex-col gap-1 ${className}`}>
      <span className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <select
        ref={ref}
        id={fieldId}
        required={required}
        className="w-full min-w-0 rounded-md border px-3 py-2"
        onChange={(e) => {
          ctx?.update(fieldId, computeFilled());
          onChange?.(e);
        }}
        {...valueProps}
      >
        {children}
      </select>
    </label>
  );
}

function Currency(props: {
  label: string;
  id?: string;
  className?: string;
  required?: boolean;
}) {
  return <Input type="number" placeholder="0.00" {...props} />;
}

function CheckboxRow({
  id,
  label,
  value,
  onChange,
}: {
  id?: string;
  label: string;
  value?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [local, setLocal] = useState(false);
  const isControlled =
    typeof value === "boolean" && typeof onChange === "function";
  const checked = isControlled ? value! : local;
  return (
    <label className="inline-flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4"
        checked={checked}
        onChange={() =>
          isControlled ? onChange!(!checked) : setLocal(!checked)
        }
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function ToggleRow({
  id,
  label,
  value,
  onChange,
}: {
  id?: string;
  label: string;
  value?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [local, setLocal] = useState(false);
  const isControlled =
    typeof value === "boolean" && typeof onChange === "function";
  const checked = isControlled ? value! : local;
  return (
    <div className="flex items-center justify-between gap-1 p-2">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        aria-pressed={checked}
        onClick={() =>
          isControlled ? onChange!(!checked) : setLocal(!checked)
        }
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-black" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function Repeater({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  const [rows, setRows] = useState<number[]>([0]);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{caption}</p>
        <div className="flex gap-2">
          {rows.length > 1 && (
            <button
              type="button"
              onClick={() => setRows((r) => r.slice(0, -1))}
              className="rounded-md border px-3 py-1 text-sm"
            >
              Remove
            </button>
          )}
          <button
            type="button"
            onClick={() => setRows((r) => [...r, r.length])}
            className="rounded-md border px-3 py-1 text-sm"
          >
            Add
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {rows.map((key) => (
          <div key={key} className="rounded-xl border p-3 bg-gray-50">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
function Requirement({
  id,
  filled,
  required = true,
}: {
  id: string;
  filled: boolean;
  required?: boolean;
}) {
  const ctx = React.useContext(SectionProgressContext);
  React.useEffect(() => {
    if (!ctx) return;
    ctx.register(id, required, filled);
    return () => ctx.unregister(id);
  }, [ctx, id, required]);
  React.useEffect(() => {
    if (!ctx) return;
    ctx.update(id, filled);
  }, [ctx, id, filled]);
  return null;
}
function EducationEntry() {
  const [enrolled, setEnrolled] = React.useState(false);
  const [earned, setEarned] = React.useState(false);
  const [awardType, setAwardType] = React.useState("");

  return (
    <>
      {/* Basics */}
      <Grid cols={5}>
        <Select label="Education type" required>
          <option value="">Select…</option>
          <option>High School</option>
          <option>GED</option>
          <option>Vocational / Trade</option>
          <option>College — Associate</option>
          <option>College — Bachelor</option>
          <option>Graduate / Professional</option>
          <option>Other</option>
        </Select>

        <Input label="Institution" required />
        <Input label="Major / Program" />
        <Input label="Years Completed" type="number" />
        <Input label="City / State" placeholder="e.g., Wilmington, DE" />
      </Grid>

      {/* Dates + enrollment */}
      <Grid cols={3}>
        <Input label="Start Date" type="date" />
        <Input
          label="End Date"
          type="date"
          className={enrolled ? "opacity-50 pointer-events-none" : ""}
        />
        <ToggleRow
          label="Currently enrolled?"
          value={enrolled}
          onChange={setEnrolled}
        />
      </Grid>

      {/* Award toggle */}
      <ToggleRow
        label="Diploma / degree earned?"
        value={earned}
        onChange={setEarned}
      />

      {/* Award details only when earned */}
      {earned && (
        <Grid cols={3}>
          <Select
            label="Award type"
            value={awardType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setAwardType(e.target.value)
            }
            required
          >
            <option value="">Select…</option>
            <option>Diploma</option>
            <option>GED</option>
            <option>Certificate</option>
            <option>Associate (AA/AS)</option>
            <option>Bachelor (BA/BS)</option>
            <option>Master (MA/MS)</option>
            <option>Doctorate (PhD/EdD)</option>
            <option>Other</option>
          </Select>

          <Input label="Award date" type="date" required />
          <Input label="Honors (optional)" />

          {/* If “Other”, ask to specify */}
          {awardType === "Other" && (
            <Input label="Specify award" required className="col-span-3" />
          )}
        </Grid>
      )}
    </>
  );
}
function EmploymentEntry() {
  const [current, setCurrent] = React.useState(false);
  const [canContact, setCanContact] = React.useState(false);

  return (
    <>
      {/* Core employment info */}
      <Grid cols={3}>
        <Input label="Employer" required />
        <Input label="Phone" required />
        <Input label="Address" />
        <Input label="Position" required />
        <Input label="Supervisor" />
        <Select label="Pay frequency" required>
          <option value="">Select…</option>
          <option>Hourly</option>
          <option>Weekly</option>
          <option>Biweekly</option>
          <option>Monthly</option>
          <option>Annually</option>
        </Select>
        <Currency label="Pay rate" required />
        <Input label="Hours per week (approx.)" type="number" />
      </Grid>

      {/* Dates + current employment gate */}
      <Grid cols={3}>
        <Input label="Start Date" type="date" required />
        <Input
          label="End Date"
          type="date"
          className={current ? "opacity-50 pointer-events-none" : ""}
        />
        <ToggleRow
          label="Currently working here?"
          value={current}
          onChange={setCurrent}
        />
      </Grid>

      {/* Contact permission gate */}
      <ToggleRow
        label="May we contact this employer?"
        value={canContact}
        onChange={setCanContact}
      />
      {canContact && (
        <Grid cols={3}>
          <Input label="Contact person" required />
          <Input label="Contact phone" required />
          <Input label="Contact email (optional)" type="email" />
        </Grid>
      )}

      {/* Leaving reason — required only if not current */}
      {!current && <Textarea label="Reason for leaving" required />}
    </>
  );
}
