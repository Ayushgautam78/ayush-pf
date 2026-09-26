import json
import urllib.request
import re

url = "https://personalfolio.framer.website/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
    
    # Search for module script chunks or searchIndex
    print("HTML length:", len(html))
    search_indices = re.findall(r'https://[^\"]*searchIndex[^\"]*\.json', html)
    print("Search index:", search_indices)
    
    if search_indices:
        with urllib.request.urlopen(search_indices[0]) as sresp:
            sdata = json.loads(sresp.read().decode('utf-8'))
            print("Search Index Keys:", sdata.keys() if isinstance(sdata, dict) else len(sdata))
            with open("scripts/framer_search_index.json", "w", encoding="utf-8") as out:
                json.dump(sdata, out, indent=2)
            print("Saved framer_search_index.json")
except Exception as e:
    print("Error:", e)
