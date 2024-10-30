async function fetchStockData() {
   const response = await fetch('http://3.22.175.40:5000/api/stock')
   const data = await response.json()
   return data
}

async function fetchCoinData() {
   const response = await fetch('http://3.22.175.40:5000/api/coin')
   const data = await response.json()
   return data
}

function displayStockData(stockData) {
   const signalsTSLA = document.querySelector('#stock-signals-tsla')
   const indicatorsTSLA = document.querySelector('#stock-indicators-tsla')
   const sentimentsTSLA = document.querySelector('#stock-sentiments-tsla')

   const signalsNVDA = document.querySelector('#stock-signals-nvda')
   const indicatorsNVDA = document.querySelector('#stock-indicators-nvda')
   const sentimentsNVDA = document.querySelector('#stock-sentiments-nvda')

   // TSLA 데이터 초기화
   signalsTSLA.innerHTML = ''
   indicatorsTSLA.innerHTML = ''
   sentimentsTSLA.innerHTML = ''

   // NVDA 데이터 초기화
   signalsNVDA.innerHTML = ''
   indicatorsNVDA.innerHTML = ''
   sentimentsNVDA.innerHTML = ''

   // 기본값 설정 (비어 있을 때 표시할 메시지)
   const defaultSignal = '최근 주식 신호가 없습니다.'
   const defaultIndicator = '최근 주식 지표 계산 정보가 없습니다.'
   const defaultSentiment = '최근 뉴스 감성 분석 데이터가 없습니다.'

   // TSLA 주식 신호 데이터 설정
   signalsTSLA.innerHTML = stockData.TSLA.signals ? `<li class="animate__animated animate__fadeInLeft">${stockData.TSLA.signals}</li>` : `<li>${defaultSignal}</li>`

   indicatorsTSLA.innerHTML = stockData.TSLA.indicators ? `<li class="animate__animated animate__fadeInLeft">${parseIndicator(stockData.TSLA.indicators)}</li>` : `<li>${defaultIndicator}</li>`

   sentimentsTSLA.innerHTML = stockData.TSLA.sentiment_analysis ? `<li class="animate__animated animate__fadeInLeft">${stockData.TSLA.sentiment_analysis}</li>` : `<li>${defaultSentiment}</li>`

   // NVDA 주식 신호 데이터 설정
   signalsNVDA.innerHTML = stockData.NVDA.signals ? `<li class="animate__animated animate__fadeInLeft">${stockData.NVDA.signals}</li>` : `<li>${defaultSignal}</li>`

   indicatorsNVDA.innerHTML = stockData.NVDA.indicators ? `<li class="animate__animated animate__fadeInLeft">${parseIndicator(stockData.NVDA.indicators)}</li>` : `<li>${defaultIndicator}</li>`

   sentimentsNVDA.innerHTML = stockData.NVDA.sentiment_analysis ? `<li class="animate__animated animate__fadeInLeft">${stockData.NVDA.sentiment_analysis}</li>` : `<li>${defaultSentiment}</li>`
}

// 지표 설명을 생성하는 함수
function parseIndicator(indicatorString) {
   const rsiMatch = indicatorString.match(/RSI=([\d.]+)/)
   const macdMatch = indicatorString.match(/MACD=([\d.]+)/)
   const signalMatch = indicatorString.match(/Signal=([\d.]+)/)

   const rsi = rsiMatch ? parseFloat(rsiMatch[1]) : null
   const macd = macdMatch ? parseFloat(macdMatch[1]) : null
   const signal = signalMatch ? parseFloat(signalMatch[1]) : null

   function getRSIExplanation(rsi) {
      if (rsi >= 70) return `${rsi} (과매수 - 주가가 과대 평가)`
      else if (rsi <= 30) return `${rsi} (과매도 - 주가가 과소 평가)`
      else return `${rsi} (중립)`
   }

   function getMACDExplanation(macd, signal) {
      if (macd > signal) return `매수 신호 - MACD가 Signal을 상회함`
      else if (macd < signal) return `매도 신호 - MACD가 Signal보다 낮음`
      else return `중립`
   }

   const rsiExplanation = rsi !== null ? `RSI: ${getRSIExplanation(rsi)}` : 'RSI 정보 없음'
   const macdExplanation = macd !== null ? `MACD: ${macd}` : 'MACD 정보 없음'
   const signalExplanation = signal !== null ? `Signal: ${signal}` : 'Signal 정보 없음'
   const overallExplanation = macd !== null && signal !== null ? `<br>(${getMACDExplanation(macd, signal)})` : ''

   return `${rsiExplanation}<br>${macdExplanation}<br>${signalExplanation}${overallExplanation}`
}

function displayCoinData(coinData) {
   const portfolioReturn = document.querySelector('#coin-return')

   // 수익률 표시
   portfolioReturn.textContent = `수익률: ${coinData.portfolio_return}`

   // 수익률 값에 따른 색상 변경
   if (parseFloat(coinData.portfolio_return) > 0) {
      portfolioReturn.style.color = 'red' // 양수일 때 빨간색
   } else if (parseFloat(coinData.portfolio_return) < 0) {
      portfolioReturn.style.color = 'blue' // 음수일 때 파란색
   } else {
      portfolioReturn.style.color = 'black' // 0일 때 검은색
   }

   // 애니메이션 클래스 추가 및 제거
   portfolioReturn.classList.remove('animate__animated', 'animate__fadeIn') // 기존 애니메이션 클래스 제거
   void portfolioReturn.offsetWidth // 트릭: DOM을 강제로 리플로우하여 클래스 재적용 가능하게 함
   portfolioReturn.classList.add('animate__animated', 'animate__fadeIn') // 애니메이션 클래스 다시 추가
}

async function updateDatacoin() {
   const coinData = await fetchCoinData()
   displayCoinData(coinData)
}
async function updateDatastock() {
   const stockData = await fetchStockData()
   displayStockData(stockData)
}

document.addEventListener('DOMContentLoaded', () => {
   // 초기 로드 시 데이터 업데이트
   updateDatacoin()
   updateDatastock()

   // 1분마다 코인 데이터 갱신
   setInterval(updateDatacoin, 60000) // 60000 밀리초 = 1분

   // 30분마다 주식 데이터 갱신
   setInterval(updateDatastock, 1800000) // 1800000 밀리초 = 30분
})

function toggleTable(tableId) {
   const tableContainer = document.getElementById(tableId)
   if (tableContainer.classList.contains('show')) {
      tableContainer.classList.remove('show')
      setTimeout(() => {
         tableContainer.style.display = 'none'
      }, 300)
   } else {
      tableContainer.style.display = 'block'
      setTimeout(() => {
         tableContainer.classList.add('show')
      }, 10)
   }
}
