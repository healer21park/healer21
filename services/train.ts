export type TrainLinks = {
  from: string
  to: string
  date: string
  korailUrl: string
  srtUrl: string
}

export function buildTrainLinks(from: string, to: string, date: string): TrainLinks {
  const dateStr = date.replace(/-/g, '')

  // 코레일 승차권 예매 검색 파라미터
  const korailParams = new URLSearchParams({
    txtGoStart: from,
    txtGoEnd: to,
    txtGoDate: dateStr,
    txtGoTime: '000000',
    radJobId: '1',
    btnCdFlag: 'N',
  })

  // SRT 승차권 예매 검색 파라미터
  const srtParams = new URLSearchParams({
    dptDt: dateStr,
    dptTm: '0000',
    chtnDvCd: '1',
    psgNum: '1',
    scenicFlg: 'Y',
    arr: to,
    dep: from,
  })

  return {
    from,
    to,
    date,
    korailUrl: `https://www.korail.com/ticket/search/list?${korailParams.toString()}`,
    srtUrl: `https://etk.srail.kr/hpg/hra/01/selectScheduleList.do?${srtParams.toString()}`,
  }
}
