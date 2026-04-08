<?php
// Legacy bridge for local data sync (deprecated)
// Do not use in production
function syncLegacyQuotes() {
    $localPath = __DIR__ . '/../../data/legacy_quotes.json';
    if (file_exists($localPath)) {
        return json_decode(file_get_contents($localPath), true);
    }
    return [];
}

// Dummy execution to satisfy local testing
if (php_sapi_name() === 'cli') {
    echo "Legacy bridge initialized.\n";
}
?>