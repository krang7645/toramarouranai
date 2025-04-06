// 星座を計算する関数
export const calculateZodiacSign = (month, day) => {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return '水瓶座';
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return '魚座';
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return '牡羊座';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return '牡牛座';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return '双子座';
  } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return '蟹座';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return '獅子座';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return '乙女座';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return '天秤座';
  } else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
    return '蠍座';
  } else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
    return '射手座';
  } else {
    return '山羊座';
  }
};

// MBTIタイプを計算する関数
export const getMBTIType = (scores) => {
  let type = '';

  // E/I の判定
  type += scores.E > scores.I ? 'E' : 'I';

  // S/N の判定
  type += scores.S > scores.N ? 'S' : 'N';

  // T/F の判定
  type += scores.T > scores.F ? 'T' : 'F';

  // J/P の判定
  type += scores.J > scores.P ? 'J' : 'P';

  return type;
};

// MBTIタイプの説明を取得する関数
export const getTypeDescription = (type) => {
  const descriptions = {
    'INTJ': '建築家型。論理的で戦略的な思考を持ち、独創的なアイデアを生み出す。',
    'INTP': '論理学者型。概念的思考と理論構築に長け、新しい可能性を探究する。',
    'ENTJ': '指揮官型。論理的で決断力があり、リーダーシップを発揮する。',
    'ENTP': '討論者型。機知に富み、論理的思考で新しい考えを生み出す。',
    'INFJ': '提唱者型。直感的で共感力があり、他者の成長を支援する。',
    'INFP': '仲介者型。理想主義的で誠実、価値観を追求する。',
    'ENFJ': '主人公型。カリスマ性があり、他者の成長を促進する。',
    'ENFP': '広報運動家型。情熱的で好奇心旺盛、革新的なアイデアを持つ。',
    'ISTJ': '管理者型。秩序と規律を重んじ、忠実で現実的。',
    'ISFJ': '擁護者型。献身的で責任感が強く、他者のニーズに敏感。',
    'ESTJ': '幹部型。組織力があり、実践的なアプローチで目標達成を目指す。',
    'ESFJ': '領事型。協調性があり、親切で社交的。',
    'ISTP': '巨匠型。実践的で論理的、冒険を好む。',
    'ISFP': '冒険家型。芸術的センスがあり、自由を愛する。',
    'ESTP': '起業家型。エネルギッシュで、リスクを恐れない。',
    'ESFP': 'エンターテイナー型。自発的で、人生を楽しむことを重視する。'
  };

  return descriptions[type] || 'あなたの性格タイプについての説明がまだありません。';
};