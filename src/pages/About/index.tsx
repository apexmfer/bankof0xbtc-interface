import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components/macro'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { UNI } from '../../constants/tokens'
import { ExternalLink, TYPE } from '../../theme'
import { RowBetween } from '../../components/Row'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
import { useUserDelegatee } from '../../state/governance/hooks'
import DelegateModal from '../../components/vote/DelegateModal'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks/web3'
import { ZERO_ADDRESS } from '../../constants/misc'
import { Token, CurrencyAmount } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { useModalOpen, useToggleDelegateModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { Trans } from '@lingui/macro'

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

export default function Vote() {
  const { account, chainId } = useActiveWeb3React()

  // toggle for showing delegation modal
  const showDelegateModal = useModalOpen(ApplicationModal.DELEGATE)
  const toggleDelegateModal = useToggleDelegateModal()

  const uniBalance: CurrencyAmount<Token> | undefined = useTokenBalance(
    account ?? undefined,
    chainId ? UNI[chainId] : undefined
  )
  const userDelegatee: string | undefined = useUserDelegatee()

  // show delegation option if they have have a balance, but have not delegated
  const showUnlockVoting = Boolean(
    uniBalance && JSBI.notEqual(uniBalance.quotient, JSBI.BigInt(0)) && userDelegatee === ZERO_ADDRESS
  )

  return (
    <>
      <PageWrapper gap="lg" justify="center">
        <DelegateModal
          isOpen={showDelegateModal}
          onDismiss={toggleDelegateModal}
          title={showUnlockVoting ? <Trans>Unlock Votes</Trans> : <Trans>Update Delegation</Trans>}
        />
        <TopSection gap="md">
          <VoteCard>
            <CardBGImage />
            <CardNoise />
            <CardSection>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>
                    <Trans>About Birbswap</Trans>
                  </TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white fontSize={14}>
                    <Trans>
                      Birbswap is an alternative frontend for UniswapV3 which prioritizes decentralized cryptocurrencies
                      as bases and for routing. Central banks have no place in the Ethereum Network and we will help
                      slowly phase them out of the space together with Birbswap.
                    </Trans>
                  </TYPE.white>
                </RowBetween>
                <ExternalLink
                  style={{ color: 'white', textDecoration: 'underline' }}
                  href="https://birbtoken.com"
                  target="_blank"
                >
                  <TYPE.white fontSize={14}>
                    <Trans>Read more about Birb</Trans>
                  </TYPE.white>
                </ExternalLink>
              </AutoColumn>
            </CardSection>
            <CardBGImage />
            <CardNoise />
          </VoteCard>
        </TopSection>
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}
