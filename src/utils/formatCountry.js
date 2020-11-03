import countryList from '@/utils/countryList'
export const formatterCountryList = function() {
  // I O Q U V 暂无
  const list = {
    '常': [{
        'short': 'SG',
        'name': '新加坡',
        'en': 'Singapore',
        'tel': '65',
        'py_name': 'xjp'
      },
      {
        'short': 'US',
        'name': '美国',
        'en': 'UnitedStatesofAmerica',
        'tel': '1',
        'py_name': 'mg'
      },
      {
        "short": "CA",
        "name": "加拿大",
        "en": "Canada",
        "tel": "1",
        "py_name": "jnd"
      },
      {
        'short': 'AU',
        'name': '澳大利亚',
        'en': 'Australia',
        'tel': '61',
        'py_name': 'adly'
      },
      {
        "short": "ID",
        "name": "印度尼西亚",
        "en": "Indonesia",
        "tel": "62",
        "py_name": "ydnxy"
      },
      {
        'short': 'MY',
        'name': '马来西亚',
        'en': 'Malaysia',
        'tel': '60',
        'py_name': 'mlxy'
      },
      {
        "short": "JP",
        "name": "日本",
        "en": "Japan",
        "tel": "81",
        "py_name": "rb"
      },
      {
        "short": "KR",
        "name": "韩国",
        "en": "Korea",
        "tel": "82",
        "py_name": "hg"
      },
    ],
    'A': [],
    'B': [],
    'C': [],
    'D': [],
    'E': [],
    'F': [],
    'G': [],
    'H': [],
    'J': [],
    'K': [],
    'L': [],
    'M': [],
    'N': [],
    'P': [],
    'R': [],
    'S': [],
    'T': [],
    'W': [],
    'X': [],
    'Y': [],
    'Z': []
  }
  countryList.list.map(item => {
    const key = item.py_name[0].toLocaleUpperCase()
    list[key].push(item)
  })
  return list
}
