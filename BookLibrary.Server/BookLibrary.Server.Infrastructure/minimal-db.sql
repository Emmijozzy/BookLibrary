CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250521232307_MinimalMigration', '8.0.12');

COMMIT;

START TRANSACTION;

CREATE TABLE "Category" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Description" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_Category" PRIMARY KEY ("Id")
);

CREATE TABLE "Books" (
    "Id" uuid NOT NULL DEFAULT (gen_random_uuid()),
    "Title" text NOT NULL,
    "Author" text NOT NULL,
    "Description" text NOT NULL,
    "Isbn" text NOT NULL,
    "PublicationDate" timestamp with time zone NOT NULL,
    "ImageUrl" text,
    "NumberOfPage" integer NOT NULL,
    "Genre" text,
    "Publisher" text NOT NULL,
    "Language" text NOT NULL,
    "PdfUrl" text,
    "CategoryId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    "CreatedBy" uuid NOT NULL,
    "IsPrivate" boolean NOT NULL,
    CONSTRAINT "PK_Books" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Books_Category_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "Category" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_Books_CategoryId" ON "Books" ("CategoryId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250521232708_MinimalMigrationBook', '8.0.12');

COMMIT;

START TRANSACTION;

ALTER TABLE "Books" DROP CONSTRAINT "FK_Books_Category_CategoryId";

ALTER TABLE "Category" DROP CONSTRAINT "PK_Category";

ALTER TABLE "Category" RENAME TO "Categories";

ALTER TABLE "Categories" ALTER COLUMN "Id" SET DEFAULT (gen_random_uuid());

ALTER TABLE "Categories" ADD CONSTRAINT "PK_Categories" PRIMARY KEY ("Id");

ALTER TABLE "Books" ADD CONSTRAINT "FK_Books_Categories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "Categories" ("Id") ON DELETE SET NULL;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250521233148_AddCategoryEntity', '8.0.12');

COMMIT;

START TRANSACTION;

CREATE TABLE "RefreshTokens" (
    "Token" text NOT NULL,
    "Expires" timestamp with time zone NOT NULL,
    "Created" timestamp with time zone NOT NULL,
    "CreatedByIp" text NOT NULL,
    "Revoked" timestamp with time zone,
    "RevokedByIp" text NOT NULL,
    "UserId" text NOT NULL,
    CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("Token")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250521233312_AddRefreshTokenEntity', '8.0.12');

COMMIT;

