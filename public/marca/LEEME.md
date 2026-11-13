# Marca jaimetr (marca personal de Jaime, noviembre 2026)

JAIMETR en mayusculas con la misma tipografia que DEVMARK (Braze, mismas proporciones) y debajo FULLSTACK
DEVELOPER en Michroma. Los colores son los del portafolio jaimetr.dev (`src/app/globals.css`): azul `#006BA9`
(el acento en claro), celeste `#23DAFC` (el acento en oscuro), tinta `#10171F`, tinta 2 `#363E48` y, sobre
oscuro, fondo `#090C11` y gris `#B0B5BB`.

## Piezas

| Pieza | Que es |
|---|---|
| `jaimetr-imagotipo*.svg` | **Principal**: simbolo + JAIMETR + lema. |
| `jaimetr-logotipo*.svg` | Solo texto: JAIMETR y debajo FULLSTACK DEVELOPER. |
| `jaimetr-isologo*.svg` | El simbolo solo (avatar, favicon): prompt `>` y una J blanca pegada abajo a la derecha. |
| `jaimetr-imagotipo-iconos*.svg` / `jaimetr-isologo-iconos*.svg` | Lo mismo con el simbolo de solo iconos de codigo (`>` y `_`), sin J. |

## Versiones (cada una por separado, como en las demas marcas)

| Sufijo | Uso |
|---|---|
| (ninguno) | Sobre fondo claro: simbolo azul con celeste, JAIME en tinta y TR en azul. |
| `-fondo-oscuro` | Sobre tinta o fotos oscuras: JAIME en blanco y TR en celeste. |
| `-cabecera` | Barra del sitio sobre oscuro: simbolo azul y todo el texto en blanco. |
| `-azul` | Una sola tinta, azul, sobre fondo claro. |
| `-blanco` | Todo en blanco, sobre azul, tinta o fotos. |
| `-oscuro` | Una sola tinta oscura (impresion, sellos). |
| `-sin-lema` | (imagotipo y logotipo) sin FULLSTACK DEVELOPER, para tamanos chicos. |

PNG transparente de cada SVG (`.png`, y `-512.png` en los isologos).

Regenerar: `PYTHONUTF8=1 python3 scripts/marca/generar-logo-jaimetr.py apps/web/public/marca/jaimetr`
(necesita fonttools y el repo Devmark-Web con las fuentes).
