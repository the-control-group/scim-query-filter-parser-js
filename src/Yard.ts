type Expression = (data: any) => boolean;

class TrackMap {
  filter = [] as Expression[];
  expression = [] as Expression[];
  precedenceGroup = [] as Expression[];
  attributeGroup = [] as Expression[];
  prefixLogicalExpression = [] as Expression[];
  prefixLogicalExpressionOperator = [] as ((
    e: Expression,
    data: any
  ) => boolean)[];
  infixLogicalExpression = [] as Expression[];
  infixLogicalExpressionPredicate = [] as ["and" | "or", Expression][];
  infixLogicalExpressionOperator = [] as ("and" | "or")[];
  postfixAssertion = [] as Expression[];
  postfixAssertionOperator = [] as ((path: string[], data: any) => boolean)[];
  infixAssertion = [] as Expression[];
  infixAssertionOperator = [] as ((
    path: string[],
    value: any,
    data: any
  ) => boolean)[];
  infixAssertionValue = [] as (null | boolean | number | string)[];
  attributePath = [] as string[][];
  attributePathSegment = [] as string[];
}

class Stat {
  filter = 0 as number;
  expression = 0 as number;
  precedenceGroup = 0 as number;
  attributeGroup = 0 as number;
  prefixLogicalExpression = 0 as number;
  prefixLogicalExpressionOperator = 0 as number;
  infixLogicalExpression = 0 as number;
  infixLogicalExpressionPredicate = 0 as number;
  infixLogicalExpressionOperator = 0 as number;
  postfixAssertion = 0 as number;
  postfixAssertionOperator = 0 as number;
  infixAssertion = 0 as number;
  infixAssertionOperator = 0 as number;
  infixAssertionValue = 0 as number;
  attributePath = 0 as number;
  attributePathSegment = 0 as number;
}

class StatsMap {
  filter = [] as Stat[];
  expression = [] as Stat[];
  precedenceGroup = [] as Stat[];
  attributeGroup = [] as Stat[];
  prefixLogicalExpression = [] as Stat[];
  prefixLogicalExpressionOperator = [] as Stat[];
  infixLogicalExpression = [] as Stat[];
  infixLogicalExpressionPredicate = [] as Stat[];
  infixLogicalExpressionOperator = [] as Stat[];
  postfixAssertion = [] as Stat[];
  postfixAssertionOperator = [] as Stat[];
  infixAssertion = [] as Stat[];
  infixAssertionOperator = [] as Stat[];
  infixAssertionValue = [] as Stat[];
  attributePath = [] as Stat[];
  attributePathSegment = [] as Stat[];
}

export class Yard {
  private stats = new StatsMap();
  public tracks = new TrackMap();

  public pre(identifier: keyof TrackMap): void {
    this.stats[identifier].push(
      (Object.keys(this.tracks) as (keyof TrackMap)[]).reduce((acc, k) => {
        acc[k] = this.tracks[k].length;
        return acc;
      }, {} as Stat)
    );
  }

  public post(identifier: keyof TrackMap): TrackMap {
    const stats = this.stats[identifier].pop();
    if (!stats) {
      throw new Error(
        `INVARIANT: stats are missing for type \`${identifier}\`.`
      );
    }

    return (Object.keys(this.tracks) as (keyof TrackMap)[]).reduce((acc, k) => {
      while (this.tracks[k].length > stats[k]) {
        acc[k].push(this.tracks[k].pop() as any);
      }

      return acc;
    }, new TrackMap());
  }
}
