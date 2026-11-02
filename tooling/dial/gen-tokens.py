# dial Phase 2 token generator (D-002). Rewrites packages/tokens/src/*.json. Run: python3 -I tooling/dial/gen-tokens.py "$PWD"
# After re-measuring from system/refs/ref-01.png, change the primitive values here (or edit the JSON and retire this script).
import json, sys, os
root = sys.argv[1]; src = os.path.join(root, 'packages/tokens/src')
EST = ' Value estimated from chat; re-measure from ref-01.png.'
def why(p, w): return {"kiln.why": {"p": p, "why": w}}
def t(v, dark=None, desc=None):
    o = {"$value": v}
    if dark is not None: o["$extensions"] = {"kiln.theme": {"dark": dark}}
    if desc: o["$description"] = desc
    return o
def grp(p, w, typ=None, **items):
    g = {}
    if typ: g["$type"] = typ
    g["$extensions"] = why(p, w)
    g.update(items); return g

# ---------------------------------------------------------------- primitive
P = {
 "color": grp(["P5","P6"], "Warm plastic, grey printing and one dyed orange. These are every hue dial owns, so nothing outside this list can appear." + EST, "color",
   abs={"50":t("#FCFBF9",desc="page behind the units, a step lighter than the body (1.21:1 flat, 1.15 measured past its shadow, G-EL1)"),"0":t("#FAF9F7",desc="lightest plastic, chips and fader caps"),
        "100":t("#E8E6E1",desc="warm white matte ABS body"),"150":t("#DEDBD5",desc="sunken well"),
        "200":t("#D3D0C9",desc="seam and divider"),"300":t("#BFBCB5",desc="unlit grille hole"),
        "500":t("#7C7973",desc="control outline, 3.5:1 on the body and 3.1:1 on a sunken well"),"700":t("#4A4844",desc="printing, secondary"),
        "800":t("#2E2D2A",desc="printing, primary"),"900":t("#1F1E1C",desc="deepest ink, focus ring")},
   charcoal={"950":t("#1C1C1B",desc="page in the dark edition"),"900":t("#232322",desc="seam, dark"),
        "850":t("#2F2F2D",desc="charcoal ABS body"),"800":t("#3A3A38",desc="raised part on charcoal"),
        "700":t("#4A4A47",desc="fader cap on charcoal"),"400":t("#7E7C77",desc="control outline on charcoal"),
        "200":t("#BDBAB3",desc="printing, secondary, dark"),"100":t("#D2CFC8",desc="printing, dark"),"50":t("#EDEBE6",desc="primary printing and focus ring, dark")},
   orange={"400":t("#F27D42",desc="orange, hover: one step lighter, ink 6.2:1"),"500":t("#EC6A2C",desc="the one dyed part, ink 5.3:1"),"600":t("#C9531C",desc="orange rim and shade, 3.55:1 on white ABS"),"700":t("#B94C18",desc="orange shade on charcoal")},
   lcd={"bg":t("#C7CBBD"),"bg-dark":t("#9FA597"),"ink":t("#2F322D"),"ink-dark":t("#1D201C"),"ghost":t("#2F322D12")},
   oled={"bg":t("#141414"),"bg-dark":t("#0B0B0B"),"ink":t("#F2F2F0")},
   green={"600":t("#2E7D46",desc="white text 5.1:1"),"400":t("#5DBB7A")},
   amber={"400":t("#F2B01E",desc="ink text above 9:1")},
   red={"600":t("#B3261E",desc="white text 6.5:1, clearly not the orange"),"400":t("#F07A72")},
   white={"$value":"#FFFFFF"},
   lit={"light":t("#FFFFFF8C",desc="lit hairline, gloss 0.2 on white ABS"),"dark":t("#FFFFFF1A")},
   shade={"light":t("#3C322829"),"dark":t("#00000073")},
   cast={"light":t("#3C322833"),"dark":t("#0000008C")},
   **{"ink-a":{"06":t("#1F1E1C0F"),"08":t("#1F1E1C14"),"14":t("#1F1E1C24"),"78":t("#1F1E1CC7")},
      "white-a":{"06":t("#FFFFFF0F"),"14":t("#FFFFFF24")}}),
 "space": grp(["P4","P6"], "A 4px step, so a grille hole, the body inset and a gap between parts all land on the same lines.", "dimension",
   **{k:t(v) for k,v in {"0":"0px","px":"1px","0-5":"2px","1":"4px","1-5":"6px","2":"8px","2-5":"10px","3":"12px","3-5":"14px","4":"16px","5":"20px","5-5":"22px","6":"24px","7":"28px","8":"32px","10":"40px","12":"48px","14":"56px","16":"64px","20":"80px","24":"96px","32":"128px"}.items()}),
 "size": grp(["P3"], "Every control keeps a 44px target even where it draws smaller, as a real knob does.", "dimension",
   **{k:t(v) for k,v in {"hairline":"1px","ring":"2px","halo":"4px","avatar-ring":"2px","avatar-sm":"32px","avatar-md":"44px","avatar-lg":"80px",
      "control-sm":"36px","control-md":"44px","control-lg":"52px","icon-sm":"16px","icon-md":"20px","measure":"32em","touch":"44px","sidebar":"280px",
      "badge":"20px","dot":"6px","bar":"4px","thumb":"24px","track":"8px","menu-min":"180px","check":"24px","switch":"52px","mark":"8px",
      "key":"44px","lamp":"6px","knob-min":"44px","cap-w":"24px","cap-h":"32px","tick":"5px"}.items()}),
 "radius": grp(["P2","P6"], "Corners about a sixth of the short side, capped so large panels never swell; inner corners nest by subtracting the inset." + EST, "dimension",
   sm=t("4px"), md=t("12px"), lg=t("20px"), xl=t("28px"), pill=t("999px"), check=t("6px")),
 "ratio": grp(["P6"], "Proportions of a unit face read from the reference, so a card of any size keeps the same corner and inset." + EST, "number",
   **{"unit-radius":t(0.16,desc="radius / short side (15–18%)"),"unit-inset":t(0.077,desc="inset / short side (≈1/13)"),"knob":t(0.36,desc="knob diameter / short side, anchor A")}),
 "font": {
   "$extensions": why(["P5"], "One grotesk in two weights, set like printing on a case, with size and position doing the hierarchy."),
   "family": {"$type":"fontFamily","sans":t("'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"),"mono":t("ui-monospace, 'SF Mono', Menlo, Consolas, monospace")},
   "size": {"$type":"dimension","$description":"ratio 1.2 from a 15px base, rounded to whole pixels: 15 × 1.2^n",
     **{k:t(v) for k,v in {"100":"11px","200":"13px","300":"14px","400":"15px","450":"16px","500":"18px","600":"22px","700":"26px","800":"37px"}.items()}},
   "weight": {"$type":"fontWeight","regular":t(400),"medium":t(500)},
   "leading": {"$type":"number","tight":t(1.15),"body":t(1.45),"long":t(1.6)},
   "tracking": {"$type":"dimension","caps":t("0.06em"),"display":t("-0.01em")}},
 "shadow": grp(["P3","P6"], "Shadows come from one light at the top left. The offset is the part's height times the light vector, so they stay short and soft.", "shadow",
   unit=t("1px 3px 10px #3C322833, inset 1px 1px 0 #FFFFFF8C, inset -1px -1px 0 #3C322829", desc="anchor A: unit height 3px"),
   **{"unit-dark":t("1px 3px 10px #0000008C, inset 1px 1px 0 #FFFFFF1A, inset -1px -1px 0 #00000073"),
      "part":t("2px 5px 15px #3C322833, inset 1px 1px 0 #FFFFFF8C, inset -1px -1px 1px #3C322829", desc="raised part, height 5px"),
      "part-dark":t("2px 5px 15px #0000008C, inset 1px 1px 0 #FFFFFF1A, inset -1px -1px 1px #00000073"),
      "float":t("2px 8px 24px #3C32283D"), "float-dark":t("2px 8px 24px #000000A6"),
      "well":t("inset 2px 2px 3px #00000038, inset -1px -1px 0 #FFFFFF8C", desc="recess, inverse light"),
      "well-dark":t("inset 2px 2px 3px #00000066, inset -1px -1px 0 #FFFFFF1A"),
      "emit-none":t("0 0 0 0 #00000000", desc="nothing emits in the light edition"),
      "emit-display-dark":t("0 0 10px 1px #F2F2F040", desc="an OLED window's own light on the charcoal body, gone within 32px"),
      "emit-lamp-dark":t("0 0 6px 2px #EDEBE699", desc="a lit status lamp's own light, a few pixels round the dot")}),
 "duration": grp(["P3","P6"], "Fast in, slow out. A press lands at once, the spring brings it back, and nothing moves while idle.", "duration",
   **{k:t(v) for k,v in {"none":"0ms","press":"65ms","segment":"80ms","brisk":"120ms","enter":"160ms","settle":"245ms","linger":"240ms","exit":"120ms","fill":"120ms"}.items()}),
 "easing": grp(["P3"], "Enter decelerates into place; exit accelerates away, because nobody watches what leaves.", "cubicBezier",
   enter=t([0.2,0.8,0.2,1]), exit=t([0.4,0,1,1]), inout=t([0.45,0,0.2,1])),
 "distance": grp(["P6"], "Parts do not lift on hover; only a sheet travels, and only a short way.", "dimension", rise=t("8px"), lift=t("0px"), press=t("3px")),
 "scale": grp(["P3"], "A key goes down by its height instead of shrinking, so press scale stays at one.", "number", press=t(1)),
 "spring": grp(["P3"], "The matte ABS spring has mass 1.4, stiffness 520, damping 46, ζ about 0.85, settling in about 245ms.", "number",
   mass=t(1.4), stiffness=t(520), damping=t(46), detents=t(11), sweep=t(270)),
 "abs": grp(["P3","P6"], "The matte ABS row of the tactile recipe. Every part reads its height, gloss and roughness from here.", "dimension",
   height=t("5px"), **{"unit-height":t("3px",desc="anchor A shallow body")}, rough=t("3px")),
 "gloss": grp(["P3"], "Gloss 0.2 for matte ABS sets how strong the lit hairline on each part is.", "number", abs=t(0.2)),
 "breakpoint": grp(["P6"], "Breakpoints where units reflow from one column to many, never inside a unit.", "dimension",
   **{k:t(v) for k,v in {"sm":"640px","md":"768px","lg":"1024px","xl":"1280px","2xl":"1536px"}.items()}),
 "container": grp(["P6"], "Page widths that hold whole units side by side without stretching a unit's face.", "dimension",
   **{k:t(v) for k,v in {"sm":"640px","md":"768px","lg":"1024px","xl":"1200px","2xl":"1440px"}.items()}),
 "columns": grp(["P6"], "Units are placed on four columns on a phone, eight on a tablet and twelve on a desktop.", "number", **{"4":t(4),"8":t(8),"12":t(12)}),
 "z": grp(["P6"], "Layers stay few. A unit sits on the page, and only sheets and messages rise above it.", "number",
   base=t(0), raised=t(10), sticky=t(100), overlay=t(1000), toast=t(1100)),
 "alpha": grp(["P6"], "Disabled parts flatten and fade to half, keeping their outline readable against the body.", "number", half=t(0.5)),
}
# ---- glass, the one accent material (P9, D-007): recipe A, frosted tinted resin lit from behind by the value.
# Tints come from the value's own range and stay quiet near the plastic; alphas are baked into the hex, the
# matte fallback (reduced transparency, forced colours) is the same body flattened onto the plastic it sits on.
GT = {"light": {"warm": "D9A55B", "cool": "7FA0B8", "neutral": "8A8780"},
      "dark":  {"warm": "D2A465", "cool": "86A3B9", "neutral": "BDBAB3"}}
GA = {"light": {"body": 0x6B, "edge": 0xB3, "glow": 0x8C},
      "dark":  {"body": 0x57, "edge": 0xB3, "glow": 0x73}}
# a lit lamp is the same hue pushed toward the ink (deeper in light, paler in dark), so lit against unlit reads at a glance
GL = {"light": {"warm": "A8722A", "cool": "4F7590", "neutral": "4A4844"},
      "dark":  {"warm": "E8C48C", "cool": "B5CCDD", "neutral": "EDEBE6"}}
GROUND = {"light": "E8E6E1", "dark": "2F2F2D"}  # color.abs.100 / color.charcoal.850, the body a glass part sits on
def over(fg, a, bg):
    f = [int(fg[i:i+2], 16) for i in (0, 2, 4)]; b = [int(bg[i:i+2], 16) for i in (0, 2, 4)]
    return "#" + "".join("%02X" % round(a/255*x + (1-a/255)*y) for x, y in zip(f, b))
def glass_ed(ed):
    out = {}
    for tint, hx in GT[ed].items():
        a = GA[ed]
        out[tint] = {"tint": t("#"+hx, desc=f"{tint} range, the value's own hue"),
                     **{k: t("#%s%02X" % (hx, a[k]), desc=f"{k}, alpha {a[k]/255:.2f}") for k in a},
                     "lamp": t("#%sE6" % GL[ed][tint], desc="a lit lamp of this range, alpha 0.90"),
                     "matte": t(over(hx, a["body"], GROUND[ed]), desc="the body flattened onto the plastic, for reduced transparency")}
    return out
P["color"]["glass"] = {"$extensions": why(["P9"], "Glass tints in three value ranges, warm amber for warmth, a cool steel for cooling and ink grey for anything neutral, each quiet and near the plastic so none becomes a second orange."),
    **glass_ed("light"), **{f"{k}-dark": v for k, v in glass_ed("dark").items()},
    "lit": t("#FFFFFF8C", desc="top-left lit hairline on glass, light"), "lit-dark": t("#FFFFFF26", desc="top-left lit hairline on glass, dark")}
P["frost"] = grp(["P9"], "The frosted glass recipe for the small parts that move is a light blur, a lift in saturation and a small brightness step, so what is behind a cap reads through it softly and the top-left light stays on its surface.", "number",
   blur={"$type":"dimension","$value":"3px","$description":"a frost, not a pane: the groove and ticks still read through a cap"},
   saturate=t(1.4), brightness=t(1.05, desc="light edition"), **{"brightness-dark":t(0.92, desc="dark edition: glass darkens a step so text on it keeps 4.5:1"),
   "fill-opacity":t(0.62, desc="the value's light in the groove behind a cap"), "solid":t(1, desc="fallback: no transparency")})
json.dump(P, open(os.path.join(src,'primitive.json'),'w'), indent=2);

# ---------------------------------------------------------------- semantic
L = lambda a,b: t("{%s}"%a, "{%s}"%b)
A = lambda a: t("{%s}"%a)
S = {
 "surface": grp(["P5","P6"], "Plastic in two editions, warm white for light and charcoal for dark, lit by the same light.",
   page=L("color.abs.50","color.charcoal.950"), solid=L("color.abs.100","color.charcoal.850"), raised=L("color.abs.100","color.charcoal.850"),
   sunken=L("color.abs.150","color.charcoal.900"), quiet=L("color.ink-a.06","color.white-a.06"), light=A("color.abs.0"),
   **{"placeholder-hi":L("color.abs.150","color.charcoal.800"),"placeholder-lo":L("color.abs.100","color.charcoal.900")},
   knob=L("color.abs.0","color.charcoal.700"), scrim=A("color.ink-a.78")),
 "text": grp(["P5"], "Printing on plastic at 4.5:1 or more in both editions; no tinted text anywhere.",
   primary=L("color.abs.800","color.charcoal.50"), secondary=L("color.abs.700","color.charcoal.100"),
   **{"on-light":A("color.abs.900"),"on-accent":A("color.abs.900")}),
 "action": grp(["P1"], "The orange is spent once per unit, on its primary control; its rim holds 3:1 against the body and hover moves one step.",
   accent=A("color.orange.500"), **{"accent-hover":A("color.orange.400"),"accent-rim":L("color.orange.600","color.orange.500"),"accent-shade":L("color.orange.600","color.orange.700")}),
 "line": grp(["P3","P5"], "Outlines a control needs at 3:1, and seams that separate regions without a hard rule.",
   ring=L("color.abs.500","color.charcoal.400"), divider=L("color.abs.200","color.charcoal.900")),
 "focus": grp(["P3"], "Every part shows the same dark ring with a plastic halo, so focus never depends on the orange.",
   ring=L("color.abs.900","color.charcoal.50"), halo=L("color.abs.0","color.charcoal.950")),
 "elevation": grp(["P3","P6"], "Height from the single top-left light; a unit never floats higher than its material allows.",
   unit=L("shadow.unit","shadow.unit-dark"), part=L("shadow.part","shadow.part-dark"), float=L("shadow.float","shadow.float-dark"),
   lift=L("shadow.part","shadow.part-dark"), well=L("shadow.well","shadow.well-dark")),
 "material": grp(["P3"], "Numbers every mechanism reads to cast its shadow and return on its spring, from the matte ABS row.",
   height=A("abs.height"), **{"unit-height":A("abs.unit-height")}, rough=A("abs.rough"), gloss=A("gloss.abs"),
   lit=L("color.lit.light","color.lit.dark"), shade=L("color.shade.light","color.shade.dark"), cast=L("color.cast.light","color.cast.dark")),
 "mechanism": grp(["P3"], "The spring and detent numbers shared by key, rotary and fader, so all parts move like one material.",
   mass=A("spring.mass"), stiffness=A("spring.stiffness"), damping=A("spring.damping"), detents=A("spring.detents"), sweep=A("spring.sweep"),
   travel=A("distance.press")),
 "emit": grp(["P2","P6"], "Only P2's emitters give off light, and only in the dark edition. They are the OLED window and a lit status lamp. LCD segments and white parts never glow.",
   display=L("shadow.emit-none","shadow.emit-display-dark"), lamp=L("shadow.emit-none","shadow.emit-lamp-dark")),
 "display": grp(["P2"], "Two window families, LCD dark segments on grey-green and OLED white on near-black, both above 4.5:1.",
   **{"lcd-bg":L("color.lcd.bg","color.lcd.bg-dark"),"lcd-ink":L("color.lcd.ink","color.lcd.ink-dark"),"lcd-ghost":A("color.lcd.ghost"),
      "oled-bg":L("color.oled.bg","color.oled.bg-dark"),"oled-ink":A("color.oled.ink")}),
 "grille": grp(["P4"], "Grille holes are recesses in body colour; a lit hole is printing ink at full step, never the orange.",
   hole=L("color.abs.300","color.charcoal.950"), **{"hole-on":L("color.abs.700","color.charcoal.100")}),
 "width": grp(["P3"], "Line widths for outlines, focus rings and bars, thin enough to read as printing.",
   hairline=A("size.hairline"), ring=A("size.ring"), halo=A("size.halo"), **{"avatar-ring":A("size.avatar-ring")}, bar=A("size.bar")),
 "gap": grp(["P4","P6"], "Gaps between parts on the 4px step; the inset is the body's own margin, about a thirteenth of its short side.",
   none=A("space.0"), xs=A("space.1"), sm=A("space.1-5"), md=A("space.2"), lg=A("space.3"), xl=A("space.3-5"), **{"2xl":A("space.4"),"3xl":A("space.6")},
   inset=A("space.6"), section=A("space.8"), page=A("space.12")),
 "control": grp(["P3"], "Keys, knobs and fader caps get 44px targets, even when the visible part is smaller.",
   sm=A("size.control-sm"), md=A("size.control-md"), lg=A("size.control-lg"), **{"icon-sm":A("size.icon-sm"),"icon-md":A("size.icon-md"),
   "avatar-sm":A("size.avatar-sm"),"avatar-md":A("size.avatar-md"),"avatar-lg":A("size.avatar-lg"),"menu-min":A("size.menu-min"),
   "knob-min":A("size.knob-min"),"cap-w":A("size.cap-w"),"cap-h":A("size.cap-h")},
   badge=A("size.badge"), dot=A("size.dot"), thumb=A("size.thumb"), track=A("size.track"), check=A("size.check"), switch=A("size.switch"),
   mark=A("size.mark"), key=A("size.key"), lamp=A("size.lamp"), tick=A("size.tick")),
 "corner": grp(["P2","P6"], "Corners nest. A unit's panel radius minus its inset gives the window and the well inside it.",
   panel=A("radius.xl"), inner=A("radius.lg"), media=A("radius.md"), round=A("radius.pill"), mark=A("radius.sm"), check=A("radius.check"),
   **{"unit-ratio":A("ratio.unit-radius"),"inset-ratio":A("ratio.unit-inset"),"knob-ratio":A("ratio.knob")}),
 "type": grp(["P5"], "Type roles for printing on a case. One family and two weights, with tabular figures and size steps on a 1.2 ratio.",
   family=A("font.family.sans"), mono=A("font.family.mono"), micro=A("font.size.100"), caption=A("font.size.200"), label=A("font.size.300"),
   body=A("font.size.400"), reading=A("font.size.450"), emphasis=A("font.size.500"), title=A("font.size.600"), headline=A("font.size.700"),
   display=A("font.size.800"), measure=A("size.measure"),
   **{"weight-regular":A("font.weight.regular"),"weight-medium":A("font.weight.medium"),
      "weight-semibold":t("{font.weight.medium}",desc="P5 allows two weights; the strongest role uses medium"),
      "leading-tight":A("font.leading.tight"),"leading-body":A("font.leading.body"),"leading-reading":A("font.leading.long"),
      "tracking-caps":A("font.tracking.caps"),"tracking-display":A("font.tracking.display")}),
 "motion": grp(["P3","P6"], "Press lands in 65ms and returns on the spring; states enter fast and leave slower; idle never moves.",
   hover={"$value":"{duration.linger}","$description":"out of hover 240ms; into hover 120ms (kiln.state)",
          "$extensions":{"kiln.state":{":hover":"{duration.brisk}"},"kiln.reduced":"keep"}},
   press=A("duration.press"), release=A("duration.settle"), enter=A("duration.enter"), exit=A("duration.exit"),
   scene=A("duration.exit"), stagger=A("duration.none"), segment=A("duration.segment"), fill=A("duration.fill"),
   easing=A("easing.enter"), **{"easing-exit":A("easing.exit"),"easing-inout":A("easing.inout"),"press-scale":A("scale.press"),"press-travel":A("distance.press")},
   rise=A("distance.rise"), lift=A("distance.lift")),
 "status": grp(["P2","P5"], "Status lamps in green, amber and red, kept apart from the orange so a warning never reads as the main control.",
   positive=A("color.green.600"), **{"on-positive":A("color.white"),"on-warning":A("color.abs.900"),"on-critical":A("color.white"),"on-info":A("color.white"),
   "info-mark":L("color.abs.700","color.charcoal.100"),"positive-mark":L("color.green.600","color.green.400"),"warning-mark":A("color.amber.400"),
   "critical-mark":L("color.red.600","color.red.400")},
   warning=A("color.amber.400"), critical=A("color.red.600"), info=A("color.abs.800")),
 "layout": grp(["P6"], "Page layout places whole units on a column grid; a unit's own face is never stretched by it.",
   columns={"$type":"number","$value":"{columns.4}","$extensions":{"kiln.breakpoint":{"md":"{columns.8}","lg":"{columns.12}"}}}, gutter={"$type":"dimension","$value":"{space.4}","$extensions":{"kiln.breakpoint":{"md":"{space.6}","lg":"{space.8}"}}}, margin={"$type":"dimension","$value":"{space.4}","$extensions":{"kiln.breakpoint":{"md":"{space.8}","lg":"{space.12}"}}}, touch=A("size.touch"), sidebar=A("size.sidebar"),
   **{f"container-{k}":A(f"container.{k}") for k in ["sm","md","lg","xl","2xl"]}),
 "layer": grp(["P6"], "Few layers. Units sit on the page, and only sheets, menus and messages stack above them.",
   **{k:A(f"z.{k}") for k in ["base","raised","sticky","overlay","toast"]}),
 "viewport": grp(["P6"], "Viewport steps at which the page grid changes its column count.", **{k:A(f"breakpoint.{k}") for k in ["sm","md","lg","xl","2xl"]}),
 "field": grp(["P6"], "The backdrop is plain plastic page with faint ink guides, because dial sits on plain surfaces only.",
   base=L("color.abs.50","color.charcoal.950"), glow=A("color.ink-a.06"), **{"glow-soft":A("color.ink-a.06"),"line-major":A("color.ink-a.14"),"on-column":L("color.abs.0","color.abs.900")},
   line=A("color.ink-a.06"), column=L("color.abs.700","color.charcoal.200"), margin=L("color.abs.700","color.charcoal.100")),
 "opacity": grp(["P6"], "Disabled parts lose height and fade to half, and their outline stays above 3:1.", disabled=A("alpha.half")),
 "glass": grp(["P9"], "The one accent material. Only caps, lamps, latched keys and chips are frosted glass, tinted in the range of the value they hold and lit through from behind by it; bodies, cards and panels stay matte ABS.",
   body=L("color.glass.neutral.body","color.glass.neutral-dark.body"), edge=L("color.glass.neutral.edge","color.glass.neutral-dark.edge"),
   lit=L("color.glass.lit","color.glass.lit-dark"),
   blur=A("frost.blur"), saturate=A("frost.saturate"), brightness=L("frost.brightness","frost.brightness-dark"),
   **{"fill-opacity":A("frost.fill-opacity"), "solid":A("frost.solid")},
   **{tint: {"$extensions": why(["P9"], f"The {tint} range gives one hue to a cap's body, its edge, the light behind it and a lit lamp, so the part and the value it holds read as one tone."),
             **{role: L(f"color.glass.{tint}.{role}", f"color.glass.{tint}-dark.{role}") for role in ["tint","body","edge","glow","lamp","matte"]}}
      for tint in ["warm","cool","neutral"]}),
}
json.dump(S, open(os.path.join(src,'semantic.json'),'w'), indent=2)
C = json.load(open(os.path.join(src,'component.json')))
C["$extensions"] = why(["P3","P6"], "Component tokens for layout primitives and focus, pointing only at semantic roles named by the principles.")
C["unit"] = grp(["P1","P2","P6"], "The device card read from anchor A. It sets the body, the panel radius ratio, the inset ratio, the knob share and the one orange.",
   bg=A("surface.solid"), shadow=A("elevation.unit"), **{"radius-ratio":A("corner.unit-ratio"),"inset-ratio":A("corner.inset-ratio"),
   "knob-ratio":A("corner.knob-ratio"),"knob-bg":A("action.accent"),"knob-shade":A("action.accent-shade"),"window-shadow":A("elevation.well")})
json.dump(C, open(os.path.join(src,'component.json'),'w'), indent=2)
print('ok')

# ---- give every semantic/component token the $type of what it points at
def types(o, inh=None, p='', out=None):
    out = {} if out is None else out
    if not isinstance(o, dict): return out
    inh = o.get('$type', inh)
    if '$value' in o: out[p] = inh; return out
    for k, v in o.items():
        if not k.startswith('$'): types(v, inh, f'{p}.{k}' if p else k, out)
    return out
PT = types(P)
def stamp(o, table, inh=None):
    if not isinstance(o, dict): return
    inh = o.get('$type', inh)
    if '$value' in o:
        v = o['$value']
        if '$type' not in o and not inh and isinstance(v, str) and v.startswith('{'):
            o['$type'] = table.get(v[1:-1])
        return
    for k, v in o.items():
        if not k.startswith('$'): stamp(v, table, inh)
stamp(S, PT); ST = {**PT, **types(S)}
json.dump(S, open(os.path.join(src,'semantic.json'),'w'), indent=2)
C = json.load(open(os.path.join(src,'component.json'))); stamp(C, ST)
json.dump(C, open(os.path.join(src,'component.json'),'w'), indent=2)
missing = [k for k,v in types(S).items() if not v]
print('untyped', missing[:5])
