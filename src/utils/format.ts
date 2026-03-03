export const formatPrice = (price: string | number | null | undefined): string => {
    if (price === null || price === undefined) return '가격 정보 없음';

    const priceString = String(price);
    // Remove all non-numeric characters
    const numericString = priceString.replace(/[^0-9]/g, '');

    const parsedPrice = parseInt(numericString, 10);

    if (isNaN(parsedPrice)) return '가격 정보 없음';

    return `${parsedPrice.toLocaleString()}원`;
};

export const cleanTitle = (title: string): string => {
    if (!title) return '';

    let cleaned = title;

    // 1. 맨 앞의 [쇼핑몰명] 제거 (예: [지마켓], [네이버] 등)
    // ^\[.*?\] : 문자열 시작부터 처음 나타나는 대괄호 묶음
    // \s* : 그 뒤에 따라오는 공백까지 포함하여 제거
    cleaned = cleaned.replace(/^\[.*?\]\s*/, '');

    // 2. 가격 + 무료배송/무배 텍스트 제거
    // 예: "18,900원/무배", "10000원 무료배송", "2만원 무배", "(무배)", "[무배]"
    // 정규식 설명:
    // (?:[0-9,]+(?:만)?원?)? : 앞부분에 숫자로 된 가격 + '만원' 또는 '원'이 있을 수 있음 (선택적)
    // (?:\/|\||-|\s)? : 슬래시, 파이프, 하이픈, 공백 등의 구분자가 있을 수 있음 (선택적)
    // \[?\(?무(?:료)?배(?:송)?\)?\]? : '무배', '무료배송' 텍스트 (앞뒤에 괄호나 대괄호가 있을 수 있음)
    // 뒤에 따라오는 불필요한 공백 제거
    const shippingRegex = /(?:[0-9,]+(?:만)?원?)?(?:\/|\||-|\s)?\[?\(?무(?:료)?배(?:송)?\)?\]?\s*/gi;

    cleaned = cleaned.replace(shippingRegex, '');

    // 3. 중복된 공백 정리
    cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

    return cleaned;
};

export const extractPriceFromTitle = (title: string): number | null => {
    if (!title) return null;

    // Strategy 1: Look for patterns like "18,900원", "18.900원", "18900원"
    // We want to capture the number part before "원", "kw", "krw"
    // We allow allow for spaces between number and unit.
    // We treat both ',' and '.' as potential thousands separators if they are roughly every 3 digits, 
    // BUT for "18.900" specifically, the user said it's a thousands separator.

    // Regex explanation:
    // ([0-9]+(?:[.,][0-9]+)*)  -> Capture a number, potentially with . or , separators
    // \s*                      -> Optional whitespace
    // (?:원|kw|krw)            -> Must be followed by a price unit
    const priceWithUnitRegex = /([0-9]+(?:[.,][0-9]{3})*)\s*(?:원|kw|krw)/i;

    const match = title.match(priceWithUnitRegex);

    if (match) {
        // match[1] is the number part, e.g. "18.900" or "18,900"
        let rawNumber = match[1];
        // Remove . and ,
        rawNumber = rawNumber.replace(/[.,]/g, '');
        const parsed = parseInt(rawNumber, 10);
        if (!isNaN(parsed)) return parsed;
    }

    // fallback: if no unit found, it's risky to just pick a number. 
    // But maybe we can look for specific "hot deal" formats if needed.
    // For now, let's stick to unit-based extraction as it's safest.

    return null;
};

export const getDisplayPrice = (dbPrice: string | number | null | undefined, title: string): string => {
    const extractedPrice = extractPriceFromTitle(title);

    if (extractedPrice !== null) {
        return `${extractedPrice.toLocaleString()}원`;
    }

    return formatPrice(dbPrice);
};

export const getPriceInfo = (price: string | number | null | undefined, title: string): { price: number; originalPrice: number } => {
    let displayPrice = 0;

    // 1. Try to extract from title
    const extracted = extractPriceFromTitle(title);
    if (extracted !== null) {
        displayPrice = extracted;
    } else if (price !== null && price !== undefined) {
        // 2. Fallback to DB price
        const numericString = String(price).replace(/[^0-9]/g, '');
        const parsed = parseInt(numericString, 10);
        if (!isNaN(parsed)) displayPrice = parsed;
    }

    return {
        price: displayPrice,
        originalPrice: 0
    };
};
