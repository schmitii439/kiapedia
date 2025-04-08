<?php
// Einbinden der Header- und Funktionsdateien
include("includes/header.php");
include("includes/functions.php");

// Laden der Daten aus den JSON-Dateien
$topics = loadJsonData("data/topics.json");   // Alle Verschwörungsthemen
$uploads = loadJsonData("data/uploads.json");   // Alle hochgeladenen Dateien
$posts = loadJsonData("data/posts.json");       // Alle Beiträge/Artikel
?>

<!-- Hauptbereich der Startseite -->
<main class="homepage" style="padding: 20px;">

    <!-- Abschnitt: Logo, Titel und Motto (wird auch im Header angezeigt, aber hier nochmal zentral) -->
    <section class="intro" style="text-align: center; margin-top: 30px;">
        <img src="assets/images/kiapedia-logo.png" alt="KIAPEDIA Logo" style="height: 80px;">
        <h1 style="font-size: 2.5em; margin: 10px 0;">KIAPEDIA</h1>
        <p style="font-style: italic; color: gray;">… ich hab mies recherchiert!</p>
    </section>

    <!-- Abschnitt: Zentrales Suchfeld mit Effekt -->
    <section class="search-section" style="text-align: center; margin-top: 40px;">
        <input 
            type="text" 
            id="searchInput" 
            placeholder="Suche nach Themen wie ‚KI‘ oder ‚Forumstipps‘" 
            style="width: 60%; padding: 12px; font-size: 1.1em; border: 1px solid #ccc; border-radius: 4px;"
            onclick="activateSearchEffect()"
        >
    </section>

    <!-- Abschnitt: Erklärtext und Statistiken -->
    <section id="contentSection" style="transition: opacity 0.5s; margin-top: 60px;">
        <!-- Erklärung -->
        <div class="explanation" style="text-align: center; margin-bottom: 40px;">
            <h2>Was ist Kiapedia?</h2>
            <p style="max-width: 800px; margin: 0 auto;">
                Kiapedia ist eine interaktive Wissensplattform, auf der alternative Theorien, geheime Strukturen und 
                kontroverse Themen gesammelt, bewertet und dokumentiert werden. Jeder Beitrag wird anhand eines "Feuer-Levels" 
                von 1 bis 10 bewertet, um die Brisanz des Themas anzuzeigen.
            </p>
        </div>

        <!-- Statistiken: Zähler für Themen, Uploads und Beiträge -->
        <div class="stats" style="display: flex; justify-content: center; gap: 60px; font-size: 1.2em;">
            <div class="stat-item" style="text-align: center;">
                <img src="assets/icons/category.png" alt="Themen" style="height: 40px;"><br>
                <strong><?php echo count($topics); ?></strong><br>
                eröffnete Theorien
            </div>
            <div class="stat-item" style="text-align: center;">
                <img src="assets/icons/doc.png" alt="Dateien" style="height: 40px;"><br>
                <strong><?php echo count($uploads); ?></strong><br>
                gesammelte Dateien
            </div>
            <div class="stat-item" style="text-align: center;">
                <img src="assets/icons/comment.png" alt="Beiträge" style="height: 40px;"><br>
                <strong><?php echo count($posts); ?></strong><br>
                Beiträge zu Themen
            </div>
        </div>
    </section>

    <!-- Abschnitt: Anzeige der letzten Uploads -->
    <section id="latestUploads" style="text-align: center; margin-top: 60px;">
        <h3>Zuletzt hochgeladene Dateien</h3>
        <ul style="list-style: none; padding: 0;">
            <?php
            // Nutzung der Funktion getLatestUploads() aus functions.php
            $latestUploads = getLatestUploads(5);
            if (!empty($latestUploads)) {
                foreach ($latestUploads as $upload) {
                    // Annahme: jedes Upload-Array enthält 'filename' und 'timestamp'
                    echo "<li style='margin: 10px 0;'>";
                    echo "<img src='assets/icons/download.png' alt='Download' style='height: 20px; vertical-align: middle;'> ";
                    echo sanitizeInput($upload['filename']) . " - " . date("d.m.Y H:i", strtotime($upload['timestamp']));
                    echo "</li>";
                }
            } else {
                echo "<li>Keine Uploads vorhanden.</li>";
            }
            ?>
        </ul>
    </section>

</main>

<!-- JavaScript für den Such-Effekt -->
<script>
function activateSearchEffect() {
    // Inhalt des Bereichs mit der ID "contentSection" wird ausgeblendet
    const contentSection = document.getElementById("contentSection");
    contentSection.style.opacity = 0;
    // Nach 60 Sekunden (60000 Millisekunden) wird der Bereich wieder eingeblendet
    setTimeout(() => {
        contentSection.style.opacity = 1;
    }, 60000);
}
</script>

<?php
// Einbinden der Footer-Datei
include("includes/footer.php");
?>
