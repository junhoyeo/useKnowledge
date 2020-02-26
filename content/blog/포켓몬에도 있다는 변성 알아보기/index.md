---
title: 포켓몬에도 있다는 변성 알아보기
date: 2020-01-09
description: 타입 레벨 프로그래밍에 있는 개념인 변성-공변성, 반공변성, 무공변성-에 대해 알아봅시다.
somethings: 3
---

![pikachu](../../assets/pikachu.png)

> 피카피!

## 타입 레벨 프로그래밍이란?
대부분의 사람들이 C언어로 프로그래밍을 처음 접합니다.
제일 먼저 `Hello World!`를 콘솔 화면에 출력한 다음에는 대게 변수를 선언하고, 사용하는 법을 배우죠.

```c
#include <stdio.h>

int main() {
  int a = 1;
  // 정수(int) 타입의 변수 a에 1을 할당해 초기화합니다.
  a += 1;
  // a에 1을 더한 값을 a에 저장합니다.
  printf("%d", a); // 2
  // a를 출력합니다.
}
```

> 프로그래밍을 시작하고 처음 변수를 접했을 때의 설렘이 기억나시나요?

여기서 변수 `a`의 선언 앞에 붙는 `int`가 바로 **타입(Type)**, 즉 자료형입니다.
`int` 외에도 `short`, `float`, `bool`, `char`, `typedef`와 `struct` 등으로 선언한 객체 등이 속하죠.

하지만 비교적 최근에 등장한 자바스크립트나 파이썬 등의 언어는, 변수를 선언할 때 위에 나온 C언어 코드처럼 타입을 명시하지 않습니다.

```javascript
foo = 123
console.log(typeof(foo))
// number
```

```py
foo = 123
print(type(foo))
# <class 'int'>
```

> 타입은 존재합니다.

명시하지 않는다고 해서 타입이라는 개념이 존재하지 않는 것은 아닙니다. 그저 인터프리터가 코드를 실행할 때 타입을 추론해서 결정해 주는 것일 뿐입니다.
자바스크립트와 파이썬은 **동적 타입(Dynamic typed) 언어**이자, **느슨한 타입(Loosely typed) 언어**입니다.

그렇기 때문에 이들 언어는 비교적 간결하며 유연한 문법을 가지고 있고, 덕분에 초보자도 비교적 쉽게 접할 수 있는 편입니다.
개발자에게 타입 체크의 자유를 줬다고 할 수 있죠.

하지만 과도한 유연함은 독이 됩니다. 같은 변수에 다른 타입의 값을 할당할 수 있는 만큼 버그 발생의 위험이 높아집니다.
자바스크립트를 하다 보면 다음과 같은 일들을 흔하게 확인할 수 있습니다.

- 여기저기서 `undefined`가 튀어나옵니다.
- 암묵적 타입 변환(implicit coercion) 기능으로 인해 잘못 넣은 타입에 대해 경고가 나오지 않고, 이를 올바른 타입으로 변환하려고 시도하게 됩니다.
- 몇몇 인터페이스를 변경되었을 때, 이에 의존적인 다른 코드들을 발견하지 못해, 의도한 대로 동작하지 않습니다.

**타입 레벨 프로그래밍(Type-level programming)**이란, 프로그램을 실행하기 전에 타입이 올바른지 검사하는 정적 타이핑을 통해 런타임에 발생하는 오류를 미연에 방지할 수 있는 프로그래밍 패러다임입니다.

이를 자바스크립트에 도입하기 위해 **타입스크립트(TypeScript)**를 사용합니다. 타입스크립트는 컴파일 시간에 타입 검사를 통해 안정성을 확보합니다.

이번 글에서는 타입 레벨 프로그래밍에 존재하는 개념인 **변성(Variance)**에 대해서 알아볼 겁니다. 강력한 타입 시스템을 지닌 함수형 프로그래밍 언어인 하스켈을 사용해 설명하는 글은 간간히 존재하지만, 타입스크립트를 사용하는 글은 잘 보이지 않아서 쓰게 되었답니다.

> [overcurried](https://overcurried.netlify.com/) 블로그를 운영하고 계신 [서재원(ENvironmentSet)](https://github.com/ENvironmentSet) 님께서 추천해 주신 주제입니다. 글을 작성하고 필요한 개념을 공부하는데도 재원님께 정말 많은 도움을 받았습니다.

## 타입 생성자
변성을 이해하기 위해서는 먼저 **타입 생성자(Type Constructor)**에 대해서 알아봐야 합니다.

자바스크립트 클래스에 있는 **생성자(constructor)** 함수를 보신 적 있나요?
생성자 함수는 `class` 내에서 객체를 생성하고, 초기화하기 위한 함수입니다.

```typescript
class Cat {
  public age: number;
  public color: string;
  public cutiness: number;

  constructor(age: number, color: string, cutiness: number) {
    this.age = age;
    this.color = color;
    this.cutiness = cutiness;
  }
}

const cat = new Cat(3, 'orange', 100);
```

클래스의 생성자는 **값 생성자(Value Constructor)**에 속합니다. 값 생성자는 어떤 타입의 값을 받아서, 그 값을 이용하는 객체를 생성합니다.

예를 들어, 위 코드에서 클래스 `Cat`의 생성자는 `number` 타입의 `age`, `string` 타입의 `color`, `number` 타입의 `cutiness`를 인수로 받고 새로운 객체 `Cat`을 반환합니다.

타입 생성자 역시 값 생성자와 동작이 같습니다. 타입을 받아서 이에 대한 새로운 타입을 만들어 반환하는 것이죠.

타입스크립트에서는 보통 이를 **제네릭(Generic)**으로 구현합니다.

## 제네릭
제네릭은 어떤 클래스나 함수 **내부에서 사용하는 데이터의 타입을 외부에서 지정하는 것**을 말합니다.

```typescript
class Store {
  private data: {
    [key: string]: number;
  } = {};

  public setItem(key: string, item: number): void {
    this.data[key] = item;
  }

  public getItem(key: string): number {
    return this.data[key];
  }
}
```

제네릭을 설명하기 위해 먼저 간단한 `Storage` 클래스를 구현해 봤습니다. `localStorage`나 `sessionStorage`처럼 `setItem`에서 주어진 `key`에 데이터(`number` 타입의 숫자)를 대응시켜 저장하고, `getItem`이 호출될 때 `key`의 데이터를 반환합니다.

```typescript
const store = new Store();

store.setItem('flag', 1);
store.getItem('flag'); // 1
```

위와 같은 방식으로 사용되는 것이죠.

```typescript
const storeForString = new Store();

storeForString.setItem('flag', 'hello');
// Argument of type '"hello"' is not assignable to parameter of type 'number'.(2345)
```

하지만 `number`가 아닌, `string` 타입의 데이터를 저장하는 새로운 객체가 필요하게 된다면 위의 구조를 재활용할 수 없습니다. 위의 `Store`는 `number`만을 다루기 때문이죠.

```typescript
class Store {...}

class StoreForString {...}
```

그렇다고 같은 코드의 구조를 타입만 바꿔서 다시 만들어야 할까요? **중복 배제 원칙(DRY, Don't Repeat Yourself)**에 맞지 않아 낭비처럼 느껴집니다.

```typescript
class Store<T> {
  private data: {
    [key: string]: T;
  } = {};

  public setItem(key: string, item: T): void {
    this.data[key] = item;
  }

  public getItem(key: string): T {
    return this.data[key];
  }
}

const storeForNumber = new Store<number>();
const storeForString = new Store<string>();
```

이럴 때 제네릭을 사용하면, 구조에서 사용할 타입을 용도에 맞게 지정하여 사용할 수 있게 됩니다.

위 코드에서 **타입 변수(Type variable)**인 `T`를 이용해 제네릭 클래스 `Store`를 만들었습니다. 이로 인해 `setItem` 메소드는 `T` 타입의 인수 `item`을 받게 되고, `getItem` 메소드는 `T` 타입의 값을 반환하게 됩니다.

`Store<number>`에서는 `number`를, `Store<string>`에서는 `string`을 `T`에 대입했습니다.

```typescript
const animals: string[] = ['bear', 'cat', 'dog'];
const animals: Array<string> = ['bear', 'cat', 'dog'];
```

다른 예시를 알아보겠습니다. 타입스크립트에서는 위에 있는 두 방식대로 배열을 초기화할 수 있는데요.

```typescript
const arrayForNumber = Array<number>();
arrayForNumber.push(1);
arrayForNumber.push('str');
// Argument of type '"str"' is not assignable to parameter of type 'number'.(2345)

const arrayForString = Array<string>();
arrayForString.push('str');
arrayForString.push(1);
// Argument of type '1' is not assignable to parameter of type 'string'.(2345)
```

이때 `Array` 역시 타입 생성자라고 할 수 있습니다. 타입 `A`를 받아서 `Array<A>`를 반환하기 때문이죠.

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
- 이변성(bivariance): 근데 이건 TS에선 안써.

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
