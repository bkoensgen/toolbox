import sys
import argparse
from pypdf import PdfWriter, PdfReader
from pathlib import Path

def merge_pdfs(input_paths, output_path):
    """
    Fusionne une liste de fichiers PDF dans un seul fichier de sortie.
    """
    pdf_writer = PdfWriter()
    
    merged_count = 0
    for path in input_paths:
        try:
            pdf_reader = PdfReader(path)
            pdf_writer.append(pdf_reader)
            print(f"  (+) Ajout de : {Path(path).name}")
            merged_count += 1
        except Exception as e:
            print(f"  [!] Erreur lors de la lecture de {Path(path).name}: {e}", file=sys.stderr)
            print(f"      Ce fichier sera ignoré.", file=sys.stderr)

    if merged_count == 0:
        print("\nAucun fichier PDF valide n'a pu être ajouté. Le fichier de sortie ne sera pas créé.", file=sys.stderr)
        return

    # Écrire le PDF final
    try:
        with open(output_path, "wb") as out_file:
            pdf_writer.write(out_file)
        print(f"\n✅ Fusion terminée ! {merged_count} fichier(s) assemblé(s) dans : {output_path}")
    except Exception as e:
        print(f"\n[!] Erreur lors de l'écriture du fichier de sortie : {e}", file=sys.stderr)


if __name__ == '__main__':
    # Mise en place de l'analyse des arguments de la ligne de commande
    parser = argparse.ArgumentParser(
        description="Fusionne plusieurs fichiers PDF en un seul. L'ordre des fichiers d'entrée détermine l'ordre de fusion."
    )
    
    # Argument pour les fichiers d'entrée : obligatoire, au moins un
    parser.add_argument(
        'input_files', 
        metavar='FICHIER_PDF', 
        type=str, 
        nargs='+',  # Accepte un ou plusieurs arguments
        help='Liste des fichiers PDF à fusionner, dans l\'ordre souhaité.'
    )
    
    # Argument pour le fichier de sortie : optionnel
    parser.add_argument(
        '-o', '--output', 
        dest='output_file', 
        type=str, 
        default='merged_output.pdf',
        help='Nom du fichier PDF de sortie. Par défaut: "merged_output.pdf".'
    )

    args = parser.parse_args()

    # Lancer la fonction principale
    merge_pdfs(args.input_files, args.output_file)