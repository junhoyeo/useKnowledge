---
title: 포켓몬에도 있다는 변성 알아보기
date: 2020-01-09
description: 공변성, 반공변성, 무공변성에 대해 알아봅시다.
somethings: 3
---

- 타입스크립트, 하스켈
- 정적 타이핑

변성(Variance)을 이해하기 위해서는 먼저 타입 생성자(Type Constructor)에 대해서 알아봐야 한다.
타입 생성자란 무엇일까
클래스에 있는 생성자(constructor) 함수는 알고 있지
메소드는 아니고 함수라네

그건 class 내에서 객체를 생성하고 초기화하기 위한 함수잖아
이건 값 생성자(데이터 생성자라고도 하는 듯)에 속해
값 생성자는 어떤 타입의 값을 받아서, 그 값의 객체를 생성하잖아

타입 생성자는 타입을 받아서 그거에 대한 새로운 타입을 만들어
https://stackoverflow.com/questions/39614311/class-constructor-type-in-typescript

타입스크립트에서는 제네릭이라는 걸로 구현하지

- 제네릭 설명

예를 들어서 Array는 타입 생성자야

타입 A를 받아서 Array<A>를 주잖아

그럼 이제 변성이 뭔지 살펴보자
변성은 타입 생성자와 타입 인수(type parameter)의 관계를 말해

Array<A> is convariant with respect to A.

이런 식으로 써

convariant가 뭐냐고?
변성에는 종류가 세 가지 있어
그전에 ADT에 대해서 알아보자

ADT는 algebraic data type을 말해
tagged union 같은 게 해당된다던데 그건 모르겠어

이것의 기초? 인 Sum of product에서는
아무튼 여기서는 3개의 타입을 기본으로 표현함

- 합 타입(Sum type): Either a b (| 이걸로 나누는 거 있잖아)
- 곱 타입(Product type): (a, b) (둘 다 맞아야 하는 거)
- 지수 타입(exponential type): a -> b (함수잖아)

이걸 조합해서 ADT 상의 모든 타입을 만들 수 있음
약간 이런식으로 ㅇㅇ
Either a (Int, Bool)

이런 걸 표준형(Canonical representation)이라고 함

- 공변성(covariant)
- 반공변성(contravariant)
- 무공변성(invariant)
- bivariance: 근데 이건 안쓰임

위에서 말한 세 개의 표준형 타입들에 존재하는 타입은 위치를 가짐
실행을 위임 postitive(+), 실행하기 위해 받는 negative(-).

하나씩 살펴보자면 타입 하나에 대해서...?

- Either a b : a, b 둘다 postitive
- (a, b): a, b 둘다 postitive
- a -> b: a는 negative, b는 postitive

그래서 A에 대해서 다음이 성립함

```typescript
number -> a // covariant
// number는 neg, a는 pos인데
// 타입 변수와 타입 생성자의 관계를 보는 거니까 number는 보는 거 아님
// a 하나니까 +

a -> number // contravariant
// a는 neg니까 -

a -> a // invariant
// 둘 다 같으니까 앞에 있는 a는 neg, 뒤에 있는 건 pos, 그래서 +-

(number -> a) -> number // contravariant
// a만 (앞에만) 보면 a는 pos, 그런데 (number -> a)로 크게 보면 neg
// - * + = - 그래서 contravariant

(a -> number) -> number // covariant
// a만 보면 neg, (number -> a) 자체도 neg, - * - = +
```

변성이라는 것 때문에 두 가지 성질이 성립함

1. Subtyping
2. Lifting

Subtyping은 supertype, subtype간의 관계

```typescript
interface FS<A> {
  (a: A): A;
}

// B <: A => FS<B> <: FS<A>  A is Covariant
// A <: B => FS<B> <: FS<A>. A is Contravairant
// B = A => FS<B> <: FS<A> A is Invariant
```

- covariant: B < A 일때 TC<A> < TC<B>
- contravariant: 저거랑 반대
- invariant: 자기 자신만

- Lifting은 일종의 변환기
- 하나의 타입에 대한 함수를 그 타입과 관련된? 다른 타입에도 적용시킬 수 있도록 추상화시켜줌
- A -> Promise<A>, A -> Array<A> 이런 식으로~

- covariant: TC<A> -> TC<B> ㄱㄴ
- contravariant: 저거랑 반대(TC<B> -> TC<A>)
- invariant: 자기 자신만(TC<A> -> TC<A>)
