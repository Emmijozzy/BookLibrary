select * from Books

INSERT INTO Books (Title, Author, ISBN, PublicationDate, Description, NumberOfPages, Genre, Publisher, Language)
VALUES 
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', '1960-07-11', 'A novel about racial injustice and moral growth in the American South.', 324, 'Fiction', 'J. B. Lippincott & Co.', 'English'),
('1984', 'George Orwell', '9780451524935', '1949-06-08', 'A dystopian novel set in a totalitarian future.', 328, 'Science Fiction', 'Secker & Warburg', 'English'),
('Pride and Prejudice', 'Jane Austen', '9780141439518', '1813-01-28', 'A romantic novel about social status and marriage.', 432, 'Romance', 'T. Egerton, Whitehall', 'English'),
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', '1925-04-10', 'A novel about the American Dream and its discontents.', 180, 'Fiction', 'Charles Scribner''s Sons', 'English'),
('Moby-Dick', 'Herman Melville', '9780142437247', '1851-10-18', 'A novel about the voyage of the whaling ship Pequod.', 624, 'Adventure', 'Harper & Brothers', 'English'),
('War and Peace', 'Leo Tolstoy', '9780192833983', '1869-01-01', 'A novel about the French invasion of Russia and the impact of the Napoleonic era on Tsarist society.', 1225, 'Historical Fiction', 'The Russian Messenger', 'Russian'),
('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', '1951-07-16', 'A novel about the experiences of a young man in New York City.', 277, 'Fiction', 'Little, Brown and Company', 'English'),
('One Hundred Years of Solitude', 'Gabriel García Márquez', '9780060883287', '1967-05-30', 'A novel about the multi-generational story of the Buendía family.', 417, 'Magical Realism', 'Harper & Row', 'Spanish'),
('The Lord of the Rings', 'J.R.R. Tolkien', '9780618640157', '1954-07-29', 'A fantasy novel about the quest to destroy the One Ring.', 1178, 'Fantasy', 'George Allen & Unwin', 'English');

CREATE TABLE Category (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(), -- GUID as primary key with default value
    Name NVARCHAR(255) NOT NULL,                     -- Required string (non-nullable)
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),   -- Default to current date/time
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()    -- Default to current date/time
);

select * from Category

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
           WHERE CONSTRAINT_NAME = 'FK_Books_Categories' AND TABLE_NAME = 'Books')
BEGIN
    ALTER TABLE Books
    DROP CONSTRAINT FK_Books_Categories;
END;

-- Step 2: Drop the Categories table (if it exists)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
           WHERE TABLE_NAME = 'Category')
BEGIN
    DROP TABLE Category;
END;

-- Step 3: Rename the Books table to Publications
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
           WHERE TABLE_NAME = 'Publications')
BEGIN
    EXEC sp_rename 'Publications', 'Books';
END;



DECLARE @TableName NVARCHAR(128) = 'Books';
INSERT INTO Books (Id, Title, Author, ISBN, PublicationDate, Description, NumberOfPage, Genre, Publisher, Language, CreatedAt, UpdatedAt)
VALUES 
(NEWID(), 'To Kill a Mockingbird', 'Harper Lee', '9780061120084', '1960-07-11', 'A novel about racial injustice and moral growth in the American South.', 324, 'Fiction', 'J. B. Lippincott & Co.', 'English', GETDATE(), GETDATE()),
(NEWID(), '1984', 'George Orwell', '9780451524935', '1949-06-08', 'A dystopian novel set in a totalitarian future.', 328, 'Science Fiction', 'Secker & Warburg', 'English', GETDATE(), GETDATE()),
(NEWID(), 'Pride and Prejudice', 'Jane Austen', '9780141439518', '1813-01-28', 'A romantic novel about social status and marriage.', 432, 'Romance', 'T. Egerton, Whitehall', 'English', GETDATE(), GETDATE()),
(NEWID(), 'The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', '1925-04-10', 'A novel about the American Dream and its discontents.', 180, 'Fiction', 'Charles Scribner''s Sons', 'English', GETDATE(), GETDATE()),
(NEWID(), 'Moby-Dick', 'Herman Melville', '9780142437247', '1851-10-18', 'A novel about the voyage of the whaling ship Pequod.', 624, 'Adventure', 'Harper & Brothers', 'English', GETDATE(), GETDATE()),
(NEWID(), 'War and Peace', 'Leo Tolstoy', '9780192833983', '1869-01-01', 'A novel about the French invasion of Russia and the impact of the Napoleonic era on Tsarist society.', 1225, 'Historical Fiction', 'The Russian Messenger', 'Russian', GETDATE(), GETDATE()),
(NEWID(), 'The Catcher in the Rye', 'J.D. Salinger', '9780316769488', '1951-07-16', 'A novel about the experiences of a young man in New York City.', 277, 'Fiction', 'Little, Brown and Company', 'English', GETDATE(), GETDATE()),
(NEWID(), 'One Hundred Years of Solitude', 'Gabriel García Márquez', '9780060883287', '1967-05-30', 'A novel about the multi-generational story of the Buendía family.', 417, 'Magical Realism', 'Harper & Row', 'Spanish', GETDATE(), GETDATE()),
(NEWID(), 'The Lord of the Rings', 'J.R.R. Tolkien', '9780618640157', '1954-07-29', 'A fantasy novel about the quest to destroy the One Ring.', 1178, 'Fantasy', 'George Allen & Unwin', 'English', GETDATE(), GETDATE());
DECLARE @SQL NVARCHAR(MAX) = 'CREATE TABLE ' + @TableName + ' (' + CHAR(13);


INSERT INTO Books (
    Id, Title, Author, Isbn, PublicationDate, Description, 
    ImageUrl, NumberOfPage, Genre, Publisher, Language, 
    CategoryId, CreatedAt, UpdatedAt
)
VALUES 
(NEWID(), 'To Kill a Mockingbird', 'Harper Lee', '9780061120084', '1960-07-11', 
 'A novel about racial injustice and moral growth in the American South.', NULL, 324, 
 'Fiction', 'J. B. Lippincott & Co.', 'English', '00000000-0000-0000-0000-000000000001', GETDATE(), GETDATE()),

(NEWID(), '1984', 'George Orwell', '9780451524935', '1949-06-08', 
 'A dystopian novel set in a totalitarian future.', NULL, 328, 
 'Science Fiction', 'Secker & Warburg', 'English', '00000000-0000-0000-0000-000000000001', GETDATE(), GETDATE()),

(NEWID(), 'Pride and Prejudice', 'Jane Austen', '9780141439518', '1813-01-28', 
 'A romantic novel about social status and marriage.', NULL, 432, 
 'Romance', 'T. Egerton, Whitehall', 'English', '00000000-0000-0000-0000-000000000001', GETDATE(), GETDATE()),

(NEWID(), 'The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', '1925-04-10', 
 'A novel about the American Dream and its discontents.', NULL, 180, 
 'Fiction', 'Charles Scribner''s Sons', 'English', '00000000-0000-0000-0000-000000000001', GETDATE(), GETDATE()),

(NEWID(), 'Moby-Dick', 'Herman Melville', '9780142437247', '1851-10-18', 
 'A novel about the voyage of the whaling ship Pequod.', NULL, 624, 
 'Adventure', 'Harper & Brothers', 'English', '00000000-0000-0000-0000-000000000001', GETDATE(), GETDATE()),

(NEWID(), 'War and Peace', 'Leo Tolstoy', '9780192833983', '1869-01-01', 
 'A novel about the French invasion of Russia and the impact of the Napoleonic era on Tsarist society.', NULL, 1225, 
 'Historical Fiction', 'The Russian Messenger', 'Russian', '00000000-0000-0000-0000-000000000001', GETDATE(), GETDATE()),

(NEWID(), 'The Catcher in the Rye', 'J.D. Salinger', '9780316769488', '1951-07-16', 
 'A novel about the experiences of a young man in New York City.', NULL, 277, 
 'Fiction', 'Little, Brown and Company', 'English', '00000000-0000-0000-0000-000000000001', GETDATE(), GETDATE()),

(NEWID(), 'One Hundred Years of Solitude', 'Gabriel García Márquez', '9780060883287', '1967-05-30', 
 'A novel about the multi-generational story of the Buendía family.', NULL, 417, 
 'Magical Realism', 'Harper & Row', 'Spanish', '00000000-0000-0000-0000-000000000001', GETDATE(), GETDATE()),

(NEWID(), 'The Lord of the Rings', 'J.R.R. Tolkien', '9780618640157', '1954-07-29', 
 'A fantasy novel about the quest to destroy the One Ring.', NULL, 1178, 
 'Fantasy', 'George Allen & Unwin', 'English', '00000000-0000-0000-0000-000000000001', GETDATE(), GETDATE());


-- Get columns and their properties
SELECT @SQL = @SQL + 
    '    ' + c.name + ' ' + 
    t.name + 
    CASE 
        WHEN t.name IN ('varchar', 'nvarchar', 'char', 'nchar') THEN '(' + CAST(c.max_length AS VARCHAR) + ')' 
        WHEN t.name IN ('decimal', 'numeric') THEN '(' + CAST(c.precision AS VARCHAR) + ',' + CAST(c.scale AS VARCHAR) + ')' 
        ELSE '' 
    END + ' ' +
    CASE 
        WHEN c.is_nullable = 0 THEN 'NOT NULL' 
        ELSE 'NULL' 
    END + ' ' +
    ISNULL('DEFAULT ' + dc.definition, '') + ',' + CHAR(13)
FROM sys.columns c
JOIN sys.types t ON c.user_type_id = t.user_type_id
LEFT JOIN sys.default_constraints dc ON c.default_object_id = dc.object_id
WHERE c.object_id = OBJECT_ID(@TableName)
ORDER BY c.column_id;

-- Remove the trailing comma and newline
SET @SQL = LEFT(@SQL, LEN(@SQL) - 2) + CHAR(13);

-- Add primary key constraint
IF EXISTS (SELECT 1 FROM sys.key_constraints WHERE type = 'PK' AND parent_object_id = OBJECT_ID(@TableName))
BEGIN
    SELECT @SQL = @SQL + 
        '    CONSTRAINT ' + kc.name + ' PRIMARY KEY (' + 
        (SELECT STRING_AGG(c.name, ', ') 
         FROM sys.index_columns ic
         JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
         WHERE ic.object_id = OBJECT_ID(@TableName) AND ic.index_id = kc.unique_index_id) + '),' + CHAR(13)
    FROM sys.key_constraints kc
    WHERE kc.type = 'PK' AND kc.parent_object_id = OBJECT_ID(@TableName);
END;

-- Remove the trailing comma and newline
SET @SQL = LEFT(@SQL, LEN(@SQL) - 2) + CHAR(13);

-- Close the CREATE TABLE statement
SET @SQL = @SQL + ');';

-- Print the generated SQL
PRINT @SQL;

-- Corrected syntax for creating a backup table
SELECT * INTO BooksBK FROM Books;

select * from Books


SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Books';

SELECT OBJECT_ID('Categories', 'U') AS TableExists,
       (SELECT COUNT(1) 
        FROM sys.indexes 
        WHERE object_id = OBJECT_ID('Categories') 
        AND is_primary_key = 1) AS HasPrimaryKey;


        SELECT * 
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_NAME = 'Categories';

SELECT * 
FROM sys.foreign_keys 
WHERE name = 'FK_Books_Categories_CategoryId';


select * from Books

SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Books' AND COLUMN_NAME = 'CategoryId';

SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Categories' AND COLUMN_NAME = 'Id';

SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Books' AND COLUMN_NAME = 'CategoryId';

Drop table Category


-- Step 3: Rename the Books table to Publications
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
           WHERE TABLE_NAME = 'Publications')
BEGIN
    EXEC sp_rename 'Publications', 'Books';
END;

select * table



DECLARE @TableName NVARCHAR(255)
DECLARE @SQL NVARCHAR(MAX)
DECLARE @ConstraintName NVARCHAR(255)

DECLARE TableCursor CURSOR FOR
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'

OPEN TableCursor
FETCH NEXT FROM TableCursor INTO @TableName

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Create backup table
    SET @SQL = 'SELECT * INTO bk_' + @TableName + ' FROM ' + @TableName
    EXEC sp_executesql @SQL

    -- Drop foreign key constraints (if any)
    DECLARE ConstraintCursor CURSOR FOR
    SELECT CONSTRAINT_NAME
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE TABLE_NAME = @TableName AND CONSTRAINT_TYPE = 'FOREIGN KEY'

    OPEN ConstraintCursor
    FETCH NEXT FROM ConstraintCursor INTO @ConstraintName

    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @SQL = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName
        EXEC sp_executesql @SQL
        FETCH NEXT FROM ConstraintCursor INTO @ConstraintName
    END

    CLOSE ConstraintCursor
    DEALLOCATE ConstraintCursor

    -- Drop the original table
    SET @SQL = 'DROP TABLE ' + @TableName
    EXEC sp_executesql @SQL

    FETCH NEXT FROM TableCursor INTO @TableName
END

CLOSE TableCursor
DEALLOCATE TableCursor



DECLARE @TableName NVARCHAR(255)
DECLARE @SQL NVARCHAR(MAX)
DECLARE @ConstraintName NVARCHAR(255)

DECLARE TableCursor CURSOR FOR
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'

OPEN TableCursor
FETCH NEXT FROM TableCursor INTO @TableName

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Create backup table
    SET @SQL = 'SELECT * INTO bk_' + @TableName + ' FROM ' + @TableName
    EXEC sp_executesql @SQL

    -- Drop foreign key constraints (if any)
    DECLARE ConstraintCursor CURSOR FOR
    SELECT CONSTRAINT_NAME
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE TABLE_NAME = @TableName AND CONSTRAINT_TYPE = 'FOREIGN KEY'

    OPEN ConstraintCursor
    FETCH NEXT FROM ConstraintCursor INTO @ConstraintName

    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @SQL = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName
        EXEC sp_executesql @SQL
        FETCH NEXT FROM ConstraintCursor INTO @ConstraintName
    END

    CLOSE ConstraintCursor
    DEALLOCATE ConstraintCursor

    -- Drop the original table
    SET @SQL = 'DROP TABLE ' + @TableName
    EXEC sp_executesql @SQL

    FETCH NEXT FROM TableCursor INTO @TableName
END

CLOSE TableCursor
DEALLOCATE TableCursor


select * from Books

select * from Categories

INSERT INTO Categories (Id, Name, CreatedAt, UpdatedAt)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Default', GETDATE(), GETDATE());



UPDATE Books
SET CategoryId = '00000000-0000-0000-0000-000000000001' -- Replace with a valid CategoryId
WHERE CategoryId is null;
