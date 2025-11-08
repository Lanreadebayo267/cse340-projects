INSERT INTO inventory (
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
VALUES (
    inv_id:integer,
    'inv_make:character varying',
    'inv_model:character varying',
    'inv_year:character',
    'inv_description:text',
    'inv_image:character varying',
    'inv_thumbnail:character varying',
    inv_price:numeric,
    inv_miles:integer,
    'inv_color:character varying',
    classification_id:integer
  );

INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

DELETE FROM account
WHERE account_email = 'tony@starkent.com';

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'AND inv_model = 'Hummer';

SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i 
INNER JOIN classification c
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

UPDATE inventory  
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');