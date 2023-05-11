<?php

ini_set('memory_limit', '1024M');

$data = [];

$names = ['John', 'Jane', 'Michael', 'Emily', 'Robert', 'Sarah', 'David', 'Jessica', 'Daniel', 'Olivia', 'Matthew', 'Ava', 'Andrew', 'Sophia', 'James', 'Isabella', 'William', 'Mia', 'Benjamin', 'Charlotte'];
$states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI'];
$items = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6', 'G7', 'H8', 'I9', 'J1', 'K2', 'L3', 'M4', 'N5', 'O6', 'P7', 'Q8', 'R9', 'S1', 'T2'];

for ($i = 1; $i <= 1000; $i++) {
    $row = [
        'id' => $i,
        'name' => generateRandomName($names),
        'state' => generateRandomState($states),
        'zip' => generateRandomZip(),
        'amount' => generateRandomFloat(),
        'qty' => generateRandomNumber(),
        'item' => generateRandomItem($items, $data),
    ];

    $data[] = $row;
}

function generateRandomName($names) {
    return $names[array_rand($names)];
}

function generateRandomState($states) {
    return $states[array_rand($states)];
}

function generateRandomZip() {
    return rand(10000, 99999);
}

function generateRandomFloat() {
    return rand(100, 999) / 10.0;
}

function generateRandomNumber() {
    return rand(1, 10);
}

function generateRandomItem($items, $orders) {
    $availableItems = array_diff($items, array_column($orders, 'item'));
    if (empty($availableItems)) {
        return 'A1B2C3';
    }
    $randomIndex = array_rand($availableItems);
    return $availableItems[$randomIndex];
}

function convertToCsvValue($value) {
    // Enclose the value in double quotes and escape any double quotes within the value
    return str_replace('"', '""', $value);
}

// Open a file handle for writing
$handle = fopen('data.csv', 'w');

// Write the header row
$headerRow = ['id', 'name', 'state', 'zip', 'amount', 'qty', 'item'];
fputcsv($handle, $headerRow);

// Write each data row
foreach ($data as $row) {
    // Create an array of values in the desired order
    $rowData = [
        $row['id'],
        $row['name'],
        $row['state'],
        $row['zip'],
        $row['amount'],
        $row['qty'],
        $row['item']
    ];

    // Convert the values to CSV format
    $csvRow = array_map('convertToCsvValue', $rowData);

    // Write the CSV row
    fputcsv($handle, $csvRow);
}

// Close the file handle
fclose($handle);

echo "Data saved as CSV";
?>