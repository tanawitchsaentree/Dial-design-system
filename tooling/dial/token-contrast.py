# Contrast of dial token pairs (tooling/contrast-check.mjs reads build/css/light.css, which no longer exists: BACKLOG K-8). Run: python3 -I tooling/dial/token-contrast.py
def lum(h):
    h=h.lstrip('#')[:6]; c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    c=[x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in c]; return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
def r(a,b): A,B=sorted([lum(a),lum(b)],reverse=True); return (A+.05)/(B+.05)
pairs={
'light text.primary/body':('#2E2D2A','#E8E6E1',4.5),'light text.secondary/body':('#4A4844','#E8E6E1',4.5),
'light text.secondary/page':('#4A4844','#F8F7F5',4.5),'light text.secondary/sunken':('#4A4844','#DEDBD5',4.5),
'light lcd':('#2F322D','#C7CBBD',4.5),'oled':('#F2F2F0','#141414',4.5),
'ink on orange':('#1F1E1C','#EC6A2C',4.5),'ink on orange-hover':('#1F1E1C','#F27D42',4.5),
'light ring/body':('#85827C','#E8E6E1',3),'light hole-on/hole':('#4A4844','#BFBCB5',3),'light focus/body':('#1F1E1C','#E8E6E1',3),
'orange rim/body (non-text)':('#C9531C','#E8E6E1',3),
'dark text.primary/body':('#EDEBE6','#2F2F2D',4.5),'dark text.secondary/body':('#D2CFC8','#2F2F2D',4.5),
'dark text.secondary/page':('#D2CFC8','#1C1C1B',4.5),'dark text.secondary/sunken':('#D2CFC8','#232322',4.5),
'dark lcd':('#1D201C','#9FA597',4.5),'dark ring/body':('#7E7C77','#2F2F2D',3),'dark hole-on/hole':('#D2CFC8','#1C1C1B',3),
'orange/charcoal (non-text)':('#EC6A2C','#2F2F2D',3),
'white/green':('#FFFFFF','#2E7D46',4.5),'white/red':('#FFFFFF','#B3261E',4.5),'ink/amber':('#1F1E1C','#F2B01E',4.5),'white/info':('#FFFFFF','#2E2D2A',4.5),
}
bad=0
for k,(a,b,need) in pairs.items():
    v=r(a,b); ok=v>=need; bad+=not ok
    if not ok or 'orange' in k: print(('✓' if ok else '✗'),k,round(v,2),'need',need)
print('fail',bad,'of',len(pairs))
