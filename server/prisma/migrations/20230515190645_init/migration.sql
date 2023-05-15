-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'AWAY', 'BUSY');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "onboardee" BOOLEAN NOT NULL DEFAULT false,
    "team" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "status" "Status" NOT NULL,
    "picture" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeSkills" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "skillId" TEXT,
    "employeeId" TEXT,

    CONSTRAINT "EmployeeSkills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EmployeeInterests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EmployeeGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InterestTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GroupTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Interest_name_key" ON "Interest"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeInterests_AB_unique" ON "_EmployeeInterests"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeInterests_B_index" ON "_EmployeeInterests"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeGroups_AB_unique" ON "_EmployeeGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeGroups_B_index" ON "_EmployeeGroups"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InterestTags_AB_unique" ON "_InterestTags"("A", "B");

-- CreateIndex
CREATE INDEX "_InterestTags_B_index" ON "_InterestTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupTags_AB_unique" ON "_GroupTags"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupTags_B_index" ON "_GroupTags"("B");

-- AddForeignKey
ALTER TABLE "EmployeeSkills" ADD CONSTRAINT "EmployeeSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSkills" ADD CONSTRAINT "EmployeeSkills_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeInterests" ADD CONSTRAINT "_EmployeeInterests_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeInterests" ADD CONSTRAINT "_EmployeeInterests_B_fkey" FOREIGN KEY ("B") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeGroups" ADD CONSTRAINT "_EmployeeGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeGroups" ADD CONSTRAINT "_EmployeeGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestTags" ADD CONSTRAINT "_InterestTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestTags" ADD CONSTRAINT "_InterestTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupTags" ADD CONSTRAINT "_GroupTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupTags" ADD CONSTRAINT "_GroupTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
