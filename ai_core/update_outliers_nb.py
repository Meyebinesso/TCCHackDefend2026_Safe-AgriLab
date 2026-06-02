import nbformat as nbf

def add_outliers_analysis_to_notebook():
    notebook_path = '../notebooks/1_EDA_Data_Preparation.ipynb'
    
    with open(notebook_path, 'r', encoding='utf-8') as f:
        nb = nbf.read(f, as_version=4)
    
    analysis_text = """\
### 📌 Synthèse Stratégique (Safe_AgriLab) - Sections 4 & 5 (Outliers et Imputation)

1. **Section 4 : Analyse des Outliers (Boîtes à moustaches)**
   - **Cacao et Soja** : Leurs boîtes sont très étroites. Leurs rendements sont donc très stables et prévisibles d'année en année au Togo.
   - **Ignames** : Le rendement est très haut (~9 000 kg/ha) mais on voit des "points" en dehors de la boîte (en haut vers 10 000 et en bas vers 8 000). Ces *Outliers* prouvent que l'Igname est très sensible aux chocs climatiques.
   - *Impact IA* : Notre modèle Random Forest apprendra que s'il y a un choc météo extrême, il faut faire très attention avant de recommander l'Igname, car son rendement risque de s'effondrer.

2. **Section 5 : Validation des Stratégies d'Imputation**
   - **NASA (Interpolation)** : Cette méthode mathématique a comblé les 6 trous avec succès. La courbe météo est réparée sans fausser la réalité.
   - **Conclusion Finale EDA** : Les données sont officiellement nettoyées et sécurisées. Nous avons une vision claire des rendements et du climat. Nous pouvons passer à la phase de Fusion.
"""
    new_cell = nbf.v4.new_markdown_cell(analysis_text)
    
    # On insère tout à la fin du notebook
    nb.cells.append(new_cell)
    
    with open(notebook_path, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
    
    print("Analyse Outliers ajoutée avec succès à la fin du notebook.")

if __name__ == "__main__":
    add_outliers_analysis_to_notebook()
