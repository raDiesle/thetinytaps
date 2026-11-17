# Geplant (noch nicht erzeugt)

> Ausgelagert aus [`bilder/README.md`](../README.md): Stilblock, Figuren und die Regeln für jedes Bild stehen dort. „Oben“ meint hier auch die Abschnitte dort und die Dateien, die das Verzeichnis dort vor dieser nennt.

Bilder, die das Spiel schon anfragt, bevor sie gemacht sind; bis sie da sind, steht an ihrer Stelle ein Platzhalter mit
dem Dateinamen (die Beschriftung darunter sagt, was er zeigen soll). Erst anschauen, dann erzeugen: zu Hause mit dem
Raum-Prompt von „Zu Hause“ oben und dem Bild des Gefühls (`baer-…`) als einziger `--ref`, nur ein Frame. Ist ein Bild
gemacht, wandert seine Zeile in ihre Tabelle oben (`feelings.test.ts` prüft beides). Jedes geplante Bild steht auch in der Bilder-Queue
(`src/content/pictureQueue.ts`) und wartet dort, bis mehrere auf einmal gemacht werden.
