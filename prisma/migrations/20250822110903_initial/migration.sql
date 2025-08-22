-- CreateEnum
CREATE TYPE "public"."Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "public"."MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'SEPARATED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "public"."LivingSituation" AS ENUM ('HOMELESS_SHELTER', 'UNHOMED', 'DEPENDENT_INSTITUTION', 'INDEPENDENT_LIVING', 'TREATMENT_CENTER', 'PRISON');

-- CreateEnum
CREATE TYPE "public"."HealthRating" AS ENUM ('VERY_GOOD', 'GOOD', 'AVERAGE', 'DECLINING');

-- CreateEnum
CREATE TYPE "public"."IncomeType" AS ENUM ('SSDI', 'SSI', 'AFDC', 'EMPLOYMENT', 'FOOD_STAMPS', 'CHILD_SUPPORT', 'UNEMPLOYMENT', 'SPOUSAL_SUPPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."InsuranceType" AS ENUM ('VA', 'MEDICAID', 'MEDICARE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."RelationshipQuality" AS ENUM ('GOOD', 'FAIR', 'POOR', 'ABSENT', 'NO_CONTACT', 'DECEASED');

-- CreateEnum
CREATE TYPE "public"."HomeLifeRating" AS ENUM ('GOOD', 'FAIR', 'POOR', 'UNSTABLE');

-- CreateEnum
CREATE TYPE "public"."SupervisionType" AS ENUM ('PROBATION', 'PAROLE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."LegalMatterType" AS ENUM ('BENEFITS', 'RECORDS_EXPUNGEMENT', 'FAMILY', 'HOUSING', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PayFrequency" AS ENUM ('HOURLY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'ANNUALLY');

-- CreateEnum
CREATE TYPE "public"."EducationType" AS ENUM ('HIGH_SCHOOL', 'GED', 'VOCATIONAL_TRADE', 'ASSOCIATE', 'BACHELOR', 'GRADUATE_PROFESSIONAL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."AwardType" AS ENUM ('DIPLOMA', 'GED', 'CERTIFICATE', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTORATE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."TreatmentProgramType" AS ENUM ('OUTPATIENT', 'INPATIENT_RESIDENTIAL', 'DETOX', 'SUPPORT_GROUP');

-- CreateEnum
CREATE TYPE "public"."ServiceType" AS ENUM ('HOUSING', 'MONEY_MANAGEMENT', 'RECREATION', 'LEGAL', 'ENTITLEMENTS', 'HEALTHCARE_COORD', 'FAMILY_SUPPORT', 'VOCATIONAL', 'TREATMENT', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Applicant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleInitial" VARCHAR(8),
    "lastName" TEXT NOT NULL,
    "sex" "public"."Sex" NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "ssn" VARCHAR(32),
    "maritalStatus" "public"."MaritalStatus" NOT NULL,
    "raceEthnicity" TEXT NOT NULL,
    "primaryLanguage" TEXT NOT NULL,
    "phoneHome" TEXT,
    "phoneWork" TEXT,
    "email" TEXT,
    "emergencyName" TEXT NOT NULL,
    "emergencyPhone" TEXT NOT NULL,
    "emergencyRelation" TEXT NOT NULL,
    "isVeteran" BOOLEAN NOT NULL DEFAULT false,
    "veteranBranch" TEXT,
    "livingSituation" "public"."LivingSituation" NOT NULL,
    "currentStreet" TEXT,
    "currentCity" TEXT,
    "currentState" TEXT,
    "currentZip" TEXT,
    "proofOfAddressType" TEXT,
    "unhomedSummary" TEXT,
    "facilityName" TEXT,
    "referralSource" TEXT NOT NULL,
    "healthRating" "public"."HealthRating" NOT NULL,
    "lastExamDate" TIMESTAMP(3),
    "relFatherUp" "public"."RelationshipQuality",
    "relFatherNow" "public"."RelationshipQuality",
    "relMotherUp" "public"."RelationshipQuality",
    "relMotherNow" "public"."RelationshipQuality",
    "raisedBy" TEXT,
    "brothersCount" INTEGER DEFAULT 0,
    "sistersCount" INTEGER DEFAULT 0,
    "homeLife" "public"."HomeLifeRating",
    "familyComments" TEXT,
    "godToYou" TEXT,
    "thinkOfGodFreq" TEXT,
    "belongsFaithCommunity" BOOLEAN NOT NULL DEFAULT false,
    "faithCommunityName" TEXT,
    "faithCommunityLeader" TEXT,
    "faithCommunityPhone" TEXT,
    "wantsSpiritualSupport" BOOLEAN NOT NULL DEFAULT false,
    "preferredSupport" TEXT,
    "contactPreference" TEXT,
    "otherSupportDetail" TEXT,
    "hasObservances" BOOLEAN NOT NULL DEFAULT false,
    "observancesDetail" TEXT,
    "hasGoalsNeeds" BOOLEAN NOT NULL DEFAULT false,
    "currentNeeds" TEXT,
    "immediateGoals" TEXT,
    "goals6m" TEXT,
    "goals1y" TEXT,
    "nlrcSupport" TEXT,
    "isWorkingOnNeeds" BOOLEAN NOT NULL DEFAULT false,
    "stepsTaken" TEXT,
    "hasBarriers" BOOLEAN NOT NULL DEFAULT false,
    "barriers" TEXT,
    "wantsCaseMgmt" BOOLEAN NOT NULL DEFAULT false,
    "preferredContact" TEXT,
    "bestTimes" TEXT,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HouseholdMember" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ssn" TEXT,
    "dob" TIMESTAMP(3) NOT NULL,
    "relationship" TEXT NOT NULL,

    CONSTRAINT "HouseholdMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IncomeEntry" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "type" "public"."IncomeType" NOT NULL,
    "amountMonthly" DECIMAL(10,2),
    "otherDesc" TEXT,

    CONSTRAINT "IncomeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InsuranceEnrollment" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "type" "public"."InsuranceType" NOT NULL,
    "vaMemberId" TEXT,
    "vaFacility" TEXT,
    "vaPhone" TEXT,
    "medicaidId" TEXT,
    "medicareId" TEXT,
    "otherCarrier" TEXT,
    "otherPlan" TEXT,
    "policyId" TEXT,
    "groupNumber" TEXT,
    "rxBin" TEXT,
    "rxPcn" TEXT,
    "carrierPhone" TEXT,
    "subscriber" TEXT,
    "relationship" TEXT,
    "subscriberDob" TIMESTAMP(3),
    "employer" TEXT,

    CONSTRAINT "InsuranceEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HealthDetail" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "illnessInjury" TEXT,
    "allergies" TEXT,
    "pcpName" TEXT,
    "pcpClinic" TEXT,
    "pcpPhone" TEXT,
    "examResults" TEXT,

    CONSTRAINT "HealthDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Hospitalization" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "hospitalName" TEXT NOT NULL,
    "dateText" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Hospitalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Medication" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "prescriber" TEXT NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Conviction" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "offense" TEXT NOT NULL,
    "jurisdiction" TEXT,
    "caseNumber" TEXT,
    "convictionDate" TIMESTAMP(3) NOT NULL,
    "disposition" TEXT NOT NULL,
    "timeServed" TEXT,

    CONSTRAINT "Conviction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Supervision" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "agency" TEXT NOT NULL,
    "officerName" TEXT NOT NULL,
    "officerPhone" TEXT NOT NULL,
    "officerEmail" TEXT,
    "type" "public"."SupervisionType" NOT NULL,
    "level" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "reportingFreq" TEXT,

    CONSTRAINT "Supervision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PendingCase" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "offense" TEXT NOT NULL,
    "jurisdiction" TEXT,
    "caseNumber" TEXT,
    "nextCourtDate" TIMESTAMP(3) NOT NULL,
    "attorney" TEXT,
    "notes" TEXT,

    CONSTRAINT "PendingCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RestrainingOrder" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "orderType" TEXT NOT NULL,
    "protectedParty" TEXT NOT NULL,
    "jurisdiction" TEXT,
    "caseNumber" TEXT,
    "expiration" TIMESTAMP(3),

    CONSTRAINT "RestrainingOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SexOffenderRegistration" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "tierLevel" TEXT NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "SexOffenderRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourtMandate" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "courtName" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "judge" TEXT,
    "terms" TEXT NOT NULL,
    "reporting" TEXT,

    CONSTRAINT "CourtMandate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FinancialObligation" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "totalDue" DECIMAL(10,2) NOT NULL,
    "payee" TEXT,
    "dueDate" TIMESTAMP(3),

    CONSTRAINT "FinancialObligation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReleaseCondition" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "detail" TEXT NOT NULL,

    CONSTRAINT "ReleaseCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TechRestriction" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "detail" TEXT NOT NULL,

    CONSTRAINT "TechRestriction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceNeed" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "type" "public"."ServiceType" NOT NULL,
    "housingPrimaryNeed" TEXT,
    "housingTimeframe" TEXT,
    "housingAccessibility" TEXT,
    "moneyGoal" TEXT,
    "paySchedulePref" TEXT,
    "recreationInterests" TEXT,
    "legalMatterType" "public"."LegalMatterType",
    "legalNextDate" TIMESTAMP(3),
    "legalAttorney" TEXT,
    "legalDescription" TEXT,
    "entPrograms" TEXT,
    "entAppliedBefore" BOOLEAN,
    "entStatus" TEXT,
    "healthCoordNeed" TEXT,
    "healthPreferredClinic" TEXT,
    "healthBestTimes" TEXT,
    "familyGoal" TEXT,
    "familyKeyContacts" TEXT,
    "familyScheduling" TEXT,
    "workGoal" TEXT,
    "workExperience" TEXT,
    "workScheduleConstraints" TEXT,
    "treatInterest" TEXT,
    "treatCurrentProvider" TEXT,
    "treatPreferredProgram" TEXT,
    "otherDescription" TEXT,
    "otherNotes" TEXT,

    CONSTRAINT "ServiceNeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EducationEntry" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "type" "public"."EducationType" NOT NULL,
    "institution" TEXT NOT NULL,
    "majorProgram" TEXT,
    "yearsCompleted" INTEGER,
    "cityState" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "currentlyEnrolled" BOOLEAN NOT NULL DEFAULT false,
    "earnedAward" BOOLEAN NOT NULL DEFAULT false,
    "awardType" "public"."AwardType",
    "awardOther" TEXT,
    "awardDate" TIMESTAMP(3),
    "honors" TEXT,

    CONSTRAINT "EducationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmploymentEntry" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "position" TEXT NOT NULL,
    "supervisor" TEXT,
    "payFrequency" "public"."PayFrequency" NOT NULL,
    "payRate" DECIMAL(10,2) NOT NULL,
    "hoursPerWeek" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    "canContact" BOOLEAN NOT NULL DEFAULT false,
    "contactPerson" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "reasonForLeaving" TEXT,

    CONSTRAINT "EmploymentEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubstanceProfile" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "ageFirstUse" INTEGER,
    "currentlyAbstinent" BOOLEAN NOT NULL DEFAULT false,
    "sobrietyStartDate" TIMESTAMP(3),
    "lastUseDate" TIMESTAMP(3),
    "narrative" TEXT,
    "primarySubstanceId" TEXT,

    CONSTRAINT "SubstanceProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TreatmentEpisode" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "programType" "public"."TreatmentProgramType" NOT NULL,
    "provider" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "completed" BOOLEAN,
    "notes" TEXT,

    CONSTRAINT "TreatmentEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Substance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Substance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApplicantSubstance" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "substanceId" TEXT NOT NULL,

    CONSTRAINT "ApplicantSubstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IncomeEntry_applicantId_type_idx" ON "public"."IncomeEntry"("applicantId", "type");

-- CreateIndex
CREATE INDEX "InsuranceEnrollment_applicantId_type_idx" ON "public"."InsuranceEnrollment"("applicantId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "HealthDetail_applicantId_key" ON "public"."HealthDetail"("applicantId");

-- CreateIndex
CREATE INDEX "Conviction_applicantId_convictionDate_idx" ON "public"."Conviction"("applicantId", "convictionDate");

-- CreateIndex
CREATE INDEX "ServiceNeed_applicantId_type_idx" ON "public"."ServiceNeed"("applicantId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "SubstanceProfile_applicantId_key" ON "public"."SubstanceProfile"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "SubstanceProfile_primarySubstanceId_key" ON "public"."SubstanceProfile"("primarySubstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "Substance_name_key" ON "public"."Substance"("name");

-- CreateIndex
CREATE INDEX "ApplicantSubstance_applicantId_idx" ON "public"."ApplicantSubstance"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicantSubstance_applicantId_substanceId_key" ON "public"."ApplicantSubstance"("applicantId", "substanceId");

-- AddForeignKey
ALTER TABLE "public"."HouseholdMember" ADD CONSTRAINT "HouseholdMember_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IncomeEntry" ADD CONSTRAINT "IncomeEntry_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InsuranceEnrollment" ADD CONSTRAINT "InsuranceEnrollment_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HealthDetail" ADD CONSTRAINT "HealthDetail_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Hospitalization" ADD CONSTRAINT "Hospitalization_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Medication" ADD CONSTRAINT "Medication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conviction" ADD CONSTRAINT "Conviction_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Supervision" ADD CONSTRAINT "Supervision_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PendingCase" ADD CONSTRAINT "PendingCase_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RestrainingOrder" ADD CONSTRAINT "RestrainingOrder_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SexOffenderRegistration" ADD CONSTRAINT "SexOffenderRegistration_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourtMandate" ADD CONSTRAINT "CourtMandate_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinancialObligation" ADD CONSTRAINT "FinancialObligation_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReleaseCondition" ADD CONSTRAINT "ReleaseCondition_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TechRestriction" ADD CONSTRAINT "TechRestriction_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceNeed" ADD CONSTRAINT "ServiceNeed_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EducationEntry" ADD CONSTRAINT "EducationEntry_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmploymentEntry" ADD CONSTRAINT "EmploymentEntry_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubstanceProfile" ADD CONSTRAINT "SubstanceProfile_primarySubstanceId_fkey" FOREIGN KEY ("primarySubstanceId") REFERENCES "public"."ApplicantSubstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubstanceProfile" ADD CONSTRAINT "SubstanceProfile_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentEpisode" ADD CONSTRAINT "TreatmentEpisode_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicantSubstance" ADD CONSTRAINT "ApplicantSubstance_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicantSubstance" ADD CONSTRAINT "ApplicantSubstance_substanceId_fkey" FOREIGN KEY ("substanceId") REFERENCES "public"."Substance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
