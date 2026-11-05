// @example A path above a unit's title; on a narrow unit it folds by itself
import { Breadcrumb, Card, Crumb, Heading, Text } from 'dial-react';

export default function BreadcrumbInUnit() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}>
      <Card
        header={
          <>
            <Breadcrumb>
              <Crumb href="#home">Home</Crumb>
              <Crumb href="#living-room">Living room</Crumb>
              <Crumb href="#lamps">Lamps</Crumb>
              <Crumb>Kitchen lamp</Crumb>
            </Breadcrumb>
            <Heading level={3}>Kitchen lamp</Heading>
          </>
        }
        wordmark="dial"
        model="lamp 2"
      >
        <Text tone="secondary">On at 60%, warm white.</Text>
      </Card>
    </div>
  );
}
