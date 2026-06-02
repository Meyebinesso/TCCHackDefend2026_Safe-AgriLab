import nbformat as nbf

def add_wb_analysis_to_notebook():
    notebook_path = '../notebooks/1_EDA_Data_Preparation.ipynb'
    
    with open(notebook_path, 'r', encoding='utf-8') as f:
        nb = nbf.read(f, as_version=4)
    
    analysis_text = """\
### 📌 Synthèse Stratégique (Safe_AgriLab) - Économie Banque Mondiale
Si nous n'avons extrait que cette unique courbe de l'immense base de données de la Banque Mondiale, c'est pour une raison très précise liée à notre objectif final :

1. **La "Valeur Ajoutée Agricole" (Le nerf de la guerre)** : Cette courbe (en Francs CFA constants - LCU) représente l'argent réel généré par l'agriculture au Togo. On voit une tendance globale très haussière (passant d'environ 580 milliards à 1000 milliards).
2. **Explication des petites chutes** : On remarque de légères baisses en 2011, 2013, 2015, et une stagnation en 2020. 
   - *Le croisement des données* : Si l'on superpose ces baisses avec nos données FAOSTAT (rendements en baisse) et NASA (sécheresse ou inondation), l'IA va comprendre la corrélation mathématique exacte entre le climat, la récolte, et **la perte financière à l'échelle du pays**.
3. **Casser le Mur de la Vente** : C'est la clé de voûte de Safe_AgriLab. En utilisant cette tendance économique croissante, notre IA pourra prédire la **valeur financière future** de la récolte d'un paysan. L'application mobile ne lui dira pas seulement "Plante de l'Igname", elle lui dira : *"Plante de l'Igname en Mai car le climat s'y prête, ton rendement estimé sera de 9 tonnes/ha, ce qui correspond à une valeur marchande optimale cette année."*

---
**✅ PHASE 1 (EDA) TERMINÉE AVEC SUCCÈS !** Les données sont propres, analysées et prêtes à être fusionnées pour l'entraînement du modèle.
"""
    new_cell = nbf.v4.new_markdown_cell(analysis_text)
    
    # On insère tout à la fin du notebook
    nb.cells.append(new_cell)
    
    with open(notebook_path, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
    
    print("Analyse Banque Mondiale ajoutée avec succès à la fin du notebook.")

if __name__ == "__main__":
    add_wb_analysis_to_notebook()
