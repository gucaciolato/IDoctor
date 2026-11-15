"""Monta o manual de identidade (HTML estático) a partir das pranchetas do canvas.

Uso: python3 build.py <pasta-do-canvas>/project  -> gera manual.html ao lado deste arquivo.
"""
import re, sys, pathlib

AQUI = pathlib.Path(__file__).resolve().parent
ORDEM = ["Main", "Versoes", "Cores", "Tipografia", "Aplicacoes", "Voz"]
BLOBS = {
    "9ad93d9c0171b9a8fced77137e31dfe8": "../kuravi-simbolo.svg",
    "8baeec9afca463905766c8827d0b75b0": "../kuravi-simbolo-negativo.svg",
    "98d818d7ee0c1b4d89b25326fc878b50": "../kuravi-app-icon.svg",
    "f898325674d752c90693eea00e66330b": "../kuravi-simbolo-mono-escuro.svg",
    "aacc8474ecc084cb32fc997b0cbe9a18": "../kuravi-simbolo-mono-claro.svg",
}

def prancheta(caminho):
    s = caminho.read_text(encoding="utf-8")
    corpo = re.search(r"<x-dc>(.*)</x-dc>", s, re.S).group(1)
    corpo = re.sub(r"<helmet>.*?</helmet>", "", corpo, flags=re.S)
    return re.sub(r"/_blob/([0-9a-f]{32})", lambda m: BLOBS[m.group(1)], corpo)

def main():
    origem = pathlib.Path(sys.argv[1])
    paginas = [prancheta(origem / f"{n}.dc.html") for n in ORDEM]
    capa = (AQUI / "capa.html").read_text(encoding="utf-8")
    aprovacao = (AQUI / "aprovacao.html").read_text(encoding="utf-8")
    secoes = "\n".join(f'<section class="pg">{p}</section>' for p in [capa, *paginas, aprovacao])
    html = f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Kuravi · Identidade visual v1</title>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;700&family=Signika:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>@page{{size:1200px 720px;margin:0}}html,body{{margin:0;padding:0;background:#F4F6FA}}
.pg{{width:1200px;height:720px;overflow:hidden;page-break-after:always;break-after:page}}.pg:last-child{{page-break-after:auto;break-after:auto}}</style>
</head><body>{secoes}</body></html>"""
    (AQUI / "manual.html").write_text(html, encoding="utf-8")

if __name__ == "__main__":
    main()
