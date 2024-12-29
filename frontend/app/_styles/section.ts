import styled from 'styled-components'

type SectionStyleProps = {
  customMediaStyles?: string
}

const SectionStyle = styled.div<SectionStyleProps>`
  background-color: #353535;
  border-radius: 14px;
  padding: 12px;

  ${({ customMediaStyles }) => customMediaStyles || ''}
`
export default SectionStyle
