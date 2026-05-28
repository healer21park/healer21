import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchForm } from './SearchForm'

const setup = () => {
  const onSubmit = vi.fn()
  render(<SearchForm onSubmit={onSubmit} />)
  return { onSubmit }
}

describe('SearchForm', () => {
  describe('산 선택 → 추천 등산로', () => {
    it('산을 선택하면 해당 산의 등산로 목록이 표시된다', async () => {
      setup()
      const select = screen.getByTestId('mountain-select')
      await userEvent.selectOptions(select, 'jirisan')
      expect(screen.getByText('성삼재 → 천왕봉 종주')).toBeInTheDocument()
      expect(screen.getByText('화엄사 → 노고단')).toBeInTheDocument()
    })

    it('등산로를 선택하면 출발지·도착지가 자동 채워진다', async () => {
      setup()
      await userEvent.selectOptions(screen.getByTestId('mountain-select'), 'jirisan')
      fireEvent.click(screen.getByText('성삼재 → 천왕봉 종주'))
      expect(screen.getByTestId('start-point').textContent).toBe('성삼재')
      expect(screen.getByTestId('end-point').textContent).toBe('천왕봉')
    })
  })

  describe('역순 전환', () => {
    it('역순 버튼 클릭 시 출발지·도착지가 바뀐다', async () => {
      setup()
      await userEvent.selectOptions(screen.getByTestId('mountain-select'), 'jirisan')
      fireEvent.click(screen.getByText('성삼재 → 천왕봉 종주'))
      fireEvent.click(screen.getByTestId('reverse-button'))
      expect(screen.getByTestId('start-point').textContent).toBe('천왕봉')
      expect(screen.getByTestId('end-point').textContent).toBe('성삼재')
    })

    it('역순 상태에서 다른 등산로 선택 시 역순이 해제된다', async () => {
      setup()
      await userEvent.selectOptions(screen.getByTestId('mountain-select'), 'jirisan')
      fireEvent.click(screen.getByText('성삼재 → 천왕봉 종주'))
      fireEvent.click(screen.getByTestId('reverse-button'))
      fireEvent.click(screen.getByText('화엄사 → 노고단'))
      expect(screen.getByTestId('start-point').textContent).toBe('화엄사')
      expect(screen.getByTestId('end-point').textContent).toBe('노고단')
    })
  })

  describe('제출 버튼 활성화', () => {
    it('산·날짜·기차역 모두 입력 시 버튼이 활성화된다', async () => {
      setup()
      const btn = screen.getByTestId('submit-button')
      expect(btn).toBeDisabled()
      await userEvent.selectOptions(screen.getByTestId('mountain-select'), 'jirisan')
      await userEvent.type(screen.getByTestId('date-input'), '2025-06-07')
      await userEvent.type(screen.getByTestId('departure-input'), '서울역')
      expect(btn).not.toBeDisabled()
    })
  })

  describe('유효성 검사', () => {
    it('미입력 상태로 제출 시 onSubmit이 호출되지 않는다', () => {
      const { onSubmit } = setup()
      const form = document.querySelector('form')!
      fireEvent.submit(form)
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('산 미선택 시 오류 메시지가 표시된다', () => {
      setup()
      const form = document.querySelector('form')!
      fireEvent.submit(form)
      expect(screen.getByTestId('mountain-error')).toBeInTheDocument()
    })
  })
})
