"""Descarga las fotos elegidas de Wikimedia Commons, las optimiza a WebP y genera los créditos.
Uso: py -3 fetch_final.py <dir_public_img> <credits.json>
"""
import io, json, os, re, sys, time, urllib.parse, urllib.request
from PIL import Image

UA = {'User-Agent': 'HorticolaDemo/1.0 (demo build)'}
PICKS = {
    'tomate': 'File:Tomato je.jpg',
    'lechuga': 'File:Lettuce Mini Heads (7331119710).jpg',
    'acelga': 'File:Organic Swiss chard bunches.jpg',
    'espinaca': 'File:Spinach leaves.jpg',
    'apio': 'File:Celery 1.jpg',
    'puerro': 'File:Leek on white background - 0947.jpg',
    'pimiento': 'File:Green-Yellow-Red-Pepper-2009.jpg',
    'berenjena': 'File:Solanum melongena 24 08 2012 (1).JPG',
    'zapallito': 'File:CSA-Striped-Zucchini.jpg',
    'pepino': 'File:Ryerson Market cucumbers on sale.jpg',
    'chaucha': 'File:Heaps of beans.jpg',
    'anco': 'File:Cucurbita moschata Butternut 2012 G2.jpg',
    'papa': 'File:Patates.jpg',
    'batata': 'File:Ipomoea batatas 006.JPG',
    'zanahoria': 'File:Carrots at Ljubljana Central Market.JPG',
    'remolacha': 'File:Detroitdarkredbeets.png',
    'cebolla': 'File:Mixed onions.jpg',
    'ajo': 'File:Garlic bulbs and cloves.jpg',
    'rabanito': 'File:Radish 3371103037 4ab07db0bf o.jpg',
    'brocoli': 'File:Broccoli and cross section edit.jpg',
    'coliflor': 'File:Chou-fleur 02.jpg',
    'repollo': 'File:Cabbage and cross section on white.jpg',
    'albahaca': 'File:Ocimum basilicum 8zz.jpg',
    'perejil': 'File:Parsley bunches - Wellington, New Zealand.jpg',
    'cilantro': 'File:Coriander Leaves.jpg',
    'frutilla': 'File:Garden strawberry (Fragaria × ananassa) single2.jpg',
    'limon': 'File:Lemon.jpg',
    'naranja': 'File:Oranges - whole-halved-segment.jpg',
    'palta': 'File:Liat Portal for Foodie Disorder - Avocado Halves.jpg',
    'bolson-familiar': 'File:Organic Vegetable Boxes - 7168488479.jpg',
    'bolson-verde': 'File:Organic Vegetable Boxes - 3085908608.jpg',
    'hero-invernadero': 'File:Tomato cultivation in France (2).jpg',
    'hero-mercado': 'File:Outdoor market fruit and vegetable stall Market Place Romford London 01.jpg',
    'hero-cajones': 'File:Carottes et poireaux de la ferme Grandjard au marché de la place Albert Thomas.jpg',
}


def get(url, tries=6):
    for i in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90).read()
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(4 * (i + 1))
                continue
            raise
    raise RuntimeError('demasiados reintentos: ' + url)


def strip_html(s):
    return re.sub(r'<[^>]+>', '', s or '').strip()


def main(out, credits_path):
    credits = {}
    names = list(PICKS.items())
    for slug, title in names:
        hero = slug.startswith('hero')
        width = 1600 if hero else 900
        q = {'action': 'query', 'format': 'json', 'titles': title, 'prop': 'imageinfo',
             'iiprop': 'url|extmetadata', 'iiurlwidth': str(width)}
        d = json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(q)))
        page = next(iter(d['query']['pages'].values()))
        if 'imageinfo' not in page:
            print('NO ENCONTRADA', slug, title)
            continue
        ii = page['imageinfo'][0]
        meta = ii.get('extmetadata', {})
        data = get(ii['thumburl'])
        im = Image.open(io.BytesIO(data)).convert('RGB')
        if not hero:
            # recorte 4:3 centrado para tarjetas parejas
            w, h = im.size
            tw, th = (w, int(w * 3 / 4)) if w * 3 / 4 <= h else (int(h * 4 / 3), h)
            l, t = (w - tw) // 2, (h - th) // 2
            im = im.crop((l, t, l + tw, t + th))
            if im.width > 800:
                im = im.resize((800, 600), Image.LANCZOS)
        elif im.width > 1600:
            im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
        sub = 'hero' if hero else 'p'
        dest = os.path.join(out, sub, slug + '.webp')
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        im.save(dest, 'WEBP', quality=80, method=6)
        credits[slug] = {
            'title': title.replace('File:', ''),
            'author': strip_html(meta.get('Artist', {}).get('value', '')),
            'license': meta.get('LicenseShortName', {}).get('value', ''),
            'source': ii['descriptionurl'],
        }
        print(slug, im.size, os.path.getsize(dest) // 1024, 'KB', credits[slug]['license'])
        time.sleep(1.2)
    with open(credits_path, 'w', encoding='utf-8') as f:
        json.dump(credits, f, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
