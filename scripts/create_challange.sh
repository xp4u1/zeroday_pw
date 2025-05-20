#!/usr/bin/env bash
# === Konfiguration ===
LABEL_SELECTOR="app=portal"
NAMESPACE="zeroday"
DB_PATH="/app/data/prod.db"

# === Pod mit Label im richtigen Namespace finden ===
PORTAL_POD=$(kubectl get pods -n "$NAMESPACE" -l "$LABEL_SELECTOR" -o jsonpath="{.items[0].metadata.name}")

if [ -z "$PORTAL_POD" ]; then
  echo " Kein Pod mit Label '$LABEL_SELECTOR' im Namespace '$NAMESPACE' gefunden."
  exit 1
fi

echo " Gefundener Pod: $PORTAL_POD (Namespace: $NAMESPACE)"

# === Interaktive Eingabe ===
read -p " Challenge-Name: " NAME
read -p " Beschreibung: " DESCRIPTION
read -p " Flag: " FLAG
read -p " Punkte: " POINTS
read -p " Imagepfad(image: ...): " IMAGE

# === SQL zusammenbauen ===
SQL=" INSERT INTO challenges VALUES(NULL,'$NAME','$DESCRIPTION','$FLAG',$POINTS,'$IMAGE',1);"

# === SQL ausführen ===
kubectl exec -n "$NAMESPACE" "$PORTAL_POD" -- sqlite3 "$DB_PATH" "$SQL"

if [ $? -eq 0 ]; then
  echo " Challenge '$NAME' wurde erfolgreich eingefügt."
else
  echo " Fehler beim Einfügen in die Datenbank."
fi
