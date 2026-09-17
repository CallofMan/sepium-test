<?php

require_once dirname(dirname(dirname(dirname(__DIR__)))) . '/src/bootstrap.php';
require_once dirname(dirname(dirname(dirname(__DIR__)))) . '/src/PropertyRenderer.php';

header('Content-Type: text/html; charset=utf-8');

$category = isset($_POST['category']) && is_array($_POST['category'])
    ? $_POST['category']
    : array();
$categoryIds = array();
$result = '';

foreach ($category as $categoryId) {
    if (is_scalar($categoryId) && preg_match('/^[1-9][0-9]*$/', (string) $categoryId)) {
        $categoryIds[(string) (int) $categoryId] = true;
    }
}

$properties = db()->query('SELECT * FROM property_s ORDER BY sort_prop, id');

while ($property = $properties->fetch()) {
    $propertyCategories = array_filter(array_map('trim', explode(',', $property['cat_prop'])), 'strlen');
    $shouldRender = count($propertyCategories) === 0;

    foreach ($propertyCategories as $propertyCategoryId) {
        if (isset($categoryIds[$propertyCategoryId])) {
            $shouldRender = true;
            break;
        }
    }

    if ($shouldRender) {
        $result .= renderProperty(db(), $property);
    }
}

echo $result;
