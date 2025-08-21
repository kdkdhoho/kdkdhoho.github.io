import React, { useEffect, useState, useRef, useCallback } from 'react'

const TableOfContents = ({ tableOfContents }) => {
  const [activeId, setActiveId] = useState('')
  const [headings, setHeadings] = useState([])
  const tocRef = useRef(null)

  // TOC에서 링크 ID 추출하기 (URL 디코딩 포함)
  const extractTocIds = useCallback((tocHtml) => {
    if (!tocHtml) return []
    
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = tocHtml
    const links = tempDiv.querySelectorAll('a[href^="#"]')
    
    return Array.from(links).map(link => {
      const href = link.getAttribute('href')
      if (!href) return null
      
      const encodedId = href.substring(1)
      
      // URL 디코딩 시도
      try {
        const decodedId = decodeURIComponent(encodedId)
        console.log(`ID 변환: ${encodedId} -> ${decodedId}`)
        return { encoded: encodedId, decoded: decodedId }
      } catch (e) {
        console.warn(`URL 디코딩 실패: ${encodedId}`, e)
        return { encoded: encodedId, decoded: encodedId }
      }
    }).filter(Boolean)
  }, [])

  // 헤딩 요소들을 찾고 저장
  useEffect(() => {
    if (!tableOfContents) return

    const findHeadings = () => {
      console.log('=== TOC Debug Start ===')
      console.log('TableOfContents HTML:', tableOfContents)
      
      // TOC에서 언급된 ID들을 추출
      const tocIdObjects = extractTocIds(tableOfContents)
      console.log('TOC에서 추출된 ID 객체들:', tocIdObjects)

      // 페이지의 모든 헤딩 요소들 확인
      const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      console.log('페이지의 모든 헤딩들:')
      allHeadings.forEach((heading, index) => {
        console.log(`${index + 1}. ID: "${heading.id}", Text: "${heading.textContent.trim()}", Tag: ${heading.tagName}`)
      })

      // 실제 DOM에서 해당 ID를 가진 헤딩 요소들 찾기
      const headingElements = []
      
      tocIdObjects.forEach(idObj => {
        // 인코딩된 ID와 디코딩된 ID 모두 시도
        let element = document.getElementById(idObj.encoded)
        if (!element) {
          element = document.getElementById(idObj.decoded)
        }
        
        if (element) {
          console.log(`ID "${idObj.encoded}" 또는 "${idObj.decoded}"에 해당하는 요소 찾음:`, element.tagName, element.textContent.trim())
          if (element.matches('h1, h2, h3, h4, h5, h6')) {
            headingElements.push(element)
          } else {
            console.warn(`ID "${idObj.encoded}"는 헤딩 요소가 아닙니다:`, element.tagName)
          }
        } else {
          console.warn(`ID "${idObj.encoded}" 또는 "${idObj.decoded}"에 해당하는 요소를 찾을 수 없습니다`)
        }
      })

      // 추가로 TOC ID가 없지만 실제 존재하는 헤딩들도 찾기
      const allHeadingsWithIds = Array.from(allHeadings).filter(h => h.id)
      console.log('ID가 있는 모든 헤딩들:', allHeadingsWithIds.map(h => ({ id: h.id, text: h.textContent.trim() })))
      
      // TOC에 없지만 실제로 존재하는 헤딩들을 포함
      allHeadingsWithIds.forEach(heading => {
        if (!headingElements.includes(heading)) {
          console.log(`TOC에 없지만 실제 존재하는 헤딩 추가: ${heading.id} - "${heading.textContent.trim()}"`)
          headingElements.push(heading)
        }
      })
      
      // 문서에서의 순서대로 정렬
      headingElements.sort((a, b) => {
        const rectA = a.getBoundingClientRect()
        const rectB = b.getBoundingClientRect()
        return rectA.top - rectB.top
      })
      
      console.log('최종 감지된 헤딩들:', headingElements.map(h => ({ id: h.id, text: h.textContent.trim() })))
      console.log('=== TOC Debug End ===')
      
      setHeadings(headingElements)
      
      // 첫 번째 헤딩을 초기 활성 상태로 설정
      if (headingElements.length > 0) {
        setActiveId(headingElements[0].id)
      }
    }

    // DOM 로드 완료 후 헤딩 찾기
    const timer = setTimeout(findHeadings, 500)
    
    return () => clearTimeout(timer)
  }, [tableOfContents, extractTocIds])

  // 스크롤 이벤트 처리
  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const scrollY = window.pageYOffset
      let currentActiveId = ''

      // 현재 화면에서 가장 가까운 헤딩 찾기
      let closestHeading = null
      let closestDistance = Infinity

      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect()
        const elementTop = rect.top
        
        // 헤딩이 화면 상단 근처에 있는 경우 우선 고려
        if (elementTop <= 200 && elementTop >= -100) {
          const distance = Math.abs(elementTop - 100)
          if (distance < closestDistance) {
            closestDistance = distance
            closestHeading = heading
          }
        }
      })

      // 가까운 헤딩이 없으면 스크롤 위치 기반으로 찾기
      if (!closestHeading) {
        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i]
          const rect = heading.getBoundingClientRect()
          const offsetTop = rect.top + scrollY
          
          if (offsetTop <= scrollY + 150) {
            closestHeading = heading
            break
          }
        }
      }

      // 여전히 없으면 첫 번째 헤딩
      if (!closestHeading && headings[0]) {
        closestHeading = headings[0]
      }

      if (closestHeading) {
        currentActiveId = closestHeading.id
      }

      if (currentActiveId !== activeId) {
        console.log(`Active ID 변경: ${activeId} -> ${currentActiveId}`)
        setActiveId(currentActiveId)
      }
    }

    // 스크롤 이벤트 등록 (디바운스 적용)
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    window.addEventListener('resize', throttledScroll, { passive: true })
    
    // 초기 실행
    handleScroll()

    return () => {
      window.removeEventListener('scroll', throttledScroll)
      window.removeEventListener('resize', throttledScroll)
    }
  }, [headings, activeId])

  // TOC 링크 클릭 처리 (URL 디코딩 포함)
  const handleTocClick = useCallback((e) => {
    if (e.target.tagName !== 'A') return
    
    e.preventDefault()
    
    const href = e.target.getAttribute('href')
    if (!href || !href.startsWith('#')) return

    const encodedId = href.substring(1)
    console.log(`TOC 링크 클릭: ${encodedId}`)
    
    // URL 디코딩 시도
    let targetElement = document.getElementById(encodedId)
    
    if (!targetElement) {
      try {
        const decodedId = decodeURIComponent(encodedId)
        console.log(`디코딩된 ID로 재시도: ${decodedId}`)
        targetElement = document.getElementById(decodedId)
      } catch (e) {
        console.warn(`URL 디코딩 실패: ${encodedId}`, e)
      }
    }
    
    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 100
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
      
      // 즉시 활성화 (실제 DOM ID 사용)
      setActiveId(targetElement.id)
    } else {
      console.warn(`클릭한 링크의 대상 요소를 찾을 수 없음: ${encodedId}`)
    }
  }, [])

  // TOC HTML에서 active 클래스 적용 (URL 인코딩 고려)
  const processedTableOfContents = React.useMemo(() => {
    if (!tableOfContents) return tableOfContents

    let processed = tableOfContents

    // 모든 링크에서 active 클래스 제거
    processed = processed.replace(/\s*class="[^"]*active[^"]*"/g, '')
    processed = processed.replace(/\s*class=""/g, '')

    // 현재 활성 ID에만 active 클래스 추가
    if (activeId) {
      // 인코딩된 형태로도 찾기
      let foundMatch = false
      
      try {
        const encodedActiveId = encodeURIComponent(activeId)
        
        // 인코딩된 ID로 먼저 시도
        const encodedRegex = new RegExp(`(<a[^>]*href="#${encodedActiveId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*)(>)`, 'g')
        if (processed.match(encodedRegex)) {
          processed = processed.replace(encodedRegex, '$1 class="active"$2')
          console.log(`Active 클래스 적용 (인코딩): ${encodedActiveId}`)
          foundMatch = true
        }
      } catch (e) {
        console.warn(`URL 인코딩 실패: ${activeId}`, e)
      }
      
      // 인코딩된 형태로 찾지 못했으면 원본 ID로 시도
      if (!foundMatch) {
        const escapedId = activeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(`(<a[^>]*href="#${escapedId}"[^>]*)(>)`, 'g')
        processed = processed.replace(regex, '$1 class="active"$2')
        console.log(`Active 클래스 적용 (원본): ${activeId}`)
      }
    }

    return processed
  }, [tableOfContents, activeId])

  if (!tableOfContents) return null

  return (
    <aside className="toc-container" ref={tocRef}>
      <h3 className="toc-title">목차</h3>
      <div 
        className="toc-content"
        onClick={handleTocClick}
        dangerouslySetInnerHTML={{ __html: processedTableOfContents }} 
      />
    </aside>
  )
}

export default TableOfContents