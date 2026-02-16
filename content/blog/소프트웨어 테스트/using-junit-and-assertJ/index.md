---
title: "JUnit과 AssertJ 활용법"
description: "코드로 보는 JUnit, AssertJ 활용법"
date: 2023-11-28
tags: ["unit-test", "JUnit", "AssertJ", "test"]
slug: "using-junit-and-assertj"
---

## 이 글의 목적

- JUnit과 AssertJ의 학습 테스트 코드를 통해 단위 테스트를 처음 해보려는 사람에게 어떻게 쓰는지 간단한 가이드 라인 제시
- 단위 테스트하면서 잘 사용하지 않는 기능에 대해 나만의 치트 시트 역할

## 전체 코드

자세한 전체 코드는 [이 곳](https://github.com/kdkdhoho/java-racingcar)에 올려놓았습니다.

위 레포지토리를 로컬에 clone하고 step3 브랜치로 이동하면, 학습 테스트가 존재합니다.

## 코드 바로 보기

### 1. 배열 또는 리스트를 테스트하기
```java
public class AssertJWithIterableStudyTest {

    @Test
    void filteredOnTest() {
        List<Member> members = members();

        assertThat(members).filteredOn(Member::job, "woowa developer")
                .hasSize(2)
                .containsOnly(
                        new Member(2, "woowa developer"),
                        new Member(4, "woowa developer")
                );
    }

    @Test
    void containsExactlyVScontainsOnly() {
        List<Member> members = members();

        // contains: 순서 상관없이 주어진 요소가 있기만 하면 된다.
        assertThat(members).extracting("id")
                .contains(5, 3, 2, 4, 1);

        // containsOnly: 순서 상관없이 주어진 요소만 있어야 한다.
        assertThat(members).extracting("id")
                .containsOnly(5, 4, 3, 2, 1);

        // containsExactly: 순서, 주어진 요소 모두 동일해야 한다.
        assertThat(members).extracting("id")
                .containsExactly(1, 2, 3, 4, 5);
    }

    @Test
    void extractingTest1() {
        List<Member> members = members();

        assertThat(members).extracting("id")
                .containsExactly(1, 2, 3, 4, 5);
    }

    @Test
    void extractingTest2() {
        List<Member> members = members();

        assertThat(members).extracting("id", "job")
                .containsExactly(
                        tuple(1, "job seeker"),
                        tuple(2, "woowa developer"),
                        tuple(3, "student"),
                        tuple(4, "woowa developer"),
                        tuple(5, "delivery hero")
                );
    }

    /**
     * [실행 결과]
     * Multiple Failures (3 failures)
     * -- failure 1 --
     * expected: 2
     * but was: 1
     * at StringTest$IterableTestUsingAssertJ.lambda$softAssertionsTest$0(StringTest$IterableTestUsingAssertJ.java:103)
     * -- failure 2 --
     * expected: 3
     * but was: 1
     * at StringTest$IterableTestUsingAssertJ.lambda$softAssertionsTest$0(StringTest$IterableTestUsingAssertJ.java:104)
     * -- failure 3 --
     * expected: 4
     * but was: 1
     */
    @Test
    @Disabled
    void softAssertionsTest() {
        SoftAssertions.assertSoftly(softly -> {
            softly.assertThat(1).isEqualTo(1);
            softly.assertThat(1).isEqualTo(2);
            softly.assertThat(1).isEqualTo(3);
            softly.assertThat(1).isEqualTo(4);
        });
    }

    public static List<Member> members() {
        return List.of(
                new Member(1, "job seeker"),
                new Member(2, "woowa developer"),
                new Member(3, "student"),
                new Member(4, "woowa developer"),
                new Member(5, "delivery hero")
        );
    }
}

class Member {
    private final int id;
    private final String job;

    public Member(int id, String job) {
        this.id = id;
        this.job = job;
    }

    public String job() {
        return job;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Member member = (Member) o;
        return id == member.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
```

### 2. 예외 검증하기

```java
public class ExceptionAssertionStudyTest {

    private void throwIllegalStateException() {
        throw new IllegalStateException("예외 1번");
    }

    @Test
    void exceptionTest_1() {
        assertThatThrownBy(this::throwIllegalStateException)
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("예외 1번")
                .hasMessageContaining("1번")
                .hasMessageEndingWith("1번");
    }

    @Test
    void exceptionTest_2() {
        assertThatExceptionOfType(IllegalStateException.class).isThrownBy(() -> throwIllegalStateException())
                .withMessage("예외 1번")
                .withMessageContaining("예외")
                .withMessageContaining("1번")
                .withMessageStartingWith("예외")
                .withMessageEndingWith("1번");
    }

    /**
     * 아래 Exception들 미리 제공
     * assertThatNullPointerException
     * assertThatIllegalArgumentException
     * assertThatIllegalStateException
     * assertThatIOException
     */
    @Test
    void exceptionTest_3() {
        assertThatIllegalStateException().isThrownBy(this::throwIllegalStateException)
                .withMessage("예외 1번")
                .withMessageContaining("예외")
                .withMessageContaining("1번")
                .withMessageStartingWith("예외")
                .withMessageEndingWith("1번");
    }

    @Test
    void notExceptionTest() {
        assertThatNoException().isThrownBy(AssertJWithIterableStudyTest::members);
    }
}
```

### 3. 테스트 메서드에 파라미터 전달하여 테스트하기

```java
public class ParameterizedStudyTest {

    /**
     * [ValueSource가 지원하는 타입]
     * short (with the shorts attribute)
     * byte (bytes attribute)
     * int (ints attribute)
     * long (longs attribute)
     * float (floats attribute)
     * double (doubles attribute)
     * char (chars attribute)
     * java.lang.String (strings attribute)
     * java.lang.Class (classes attribute)
     */
    @ParameterizedTest
    @ValueSource(ints = {2, 4, 6})
    void parameterizedTest_with_valueSource(int number) {
        assertThat(number % 2 == 0).isTrue();
    }

    @ParameterizedTest
    @NullSource
    void parameterizedTest_with_nullSource(String input) {
        assertThat(input == null).isTrue();
    }

    @ParameterizedTest
    @EmptySource
    void parameterizedTest_with_emptySource_Array(int[] numbers) {
        assertThat(numbers.length).isZero();
    }

    @ParameterizedTest
    @EmptySource
    void parameterizedTest_with_emptySource_List(List<Integer> numbers) {
        assertThat(numbers.size()).isZero();
    }

    @ParameterizedTest
    @EmptySource
    void parameterizedTest_with_emptySource_String(String input) {
        assertThat(input).isEqualTo("");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {" ", "\t", "\n"})
    void parameterizedTest_with_NullAndEmptySource(String input) {
        assertThat(Strings.isNullOrEmpty(input) || input.isBlank()).isTrue();
    }

    private enum Direction {
        NORTH, EAST, SOUTH, WEST;
    }

    // pass all 4 directions
    @ParameterizedTest
    @EnumSource(value = Direction.class)
    void parameterizedTest_with_EnumSource_All_Passing(Direction direction) {
        assertThat(direction).isIn(Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST);
    }

    @ParameterizedTest
    @EnumSource(value = Direction.class, names = {"NORTH", "SOUTH"})
    void parameterizedTest_with_EnumSource_names_filter(Direction direction) {
        assertThat(direction).isIn(Direction.NORTH, Direction.SOUTH);
        assertThat(direction).isNotIn(Direction.EAST, Direction.WEST);
    }

    @ParameterizedTest
    @EnumSource(
            value = Direction.class,
            names = {"NORTH", "SOUTH", "EAST"}, // Enum의 value 이름과 매칭한다. 대소문자 구분한다.
            mode = EnumSource.Mode.EXCLUDE
    )
    void parameterizedTest_with_EnumSource_names_filter_exclude(Direction direction) {
        assertThat(direction).isNotIn(Direction.NORTH, Direction.SOUTH);
        assertThat(direction).isIn(Direction.EAST, Direction.WEST);
    }

    @ParameterizedTest
    @CsvSource({"test,TEST", "java,JAVA"})
    void parameterizedTest_with_CsvSource(String input, String expected) {
        assertThat(input.toUpperCase()).isEqualTo(expected);
    }

    @ParameterizedTest
    @CsvSource(value = {"test:TEST", "java:JAVA"}, delimiter = ':')
    void parameterizedTest_with_CsvSource_Using_Delimiter(String input, String expected) {
        assertThat(input.toUpperCase()).isEqualTo(expected);
    }

    @ParameterizedTest
    @CsvFileSource(resources = "/csvFile.txt", numLinesToSkip = 1)
    void parameterizedTest_with_CsvSource_Using_CsvFile(String input, String expected) {
        assertThat(input.toUpperCase()).isEqualTo(expected);
    }

    @ParameterizedTest
    @MethodSource("provideStringForIsBlank")
    void parameterizedTest_with_MethodSource(String input, boolean expected) {
        assertThat(StringUtils.isBlank(input)).isEqualTo(expected);
    }

    private static Stream<Arguments> provideStringForIsBlank() {
        List<String> inputs = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            if (i == 3) {
                String input = "not Empty";
                inputs.add(input);
                continue;
            }

            String input = " ".repeat(i);
            inputs.add(input);
        }

        return Stream.of(
                Arguments.of(inputs.get(0), true),
                Arguments.of(inputs.get(1), true),
                Arguments.of(inputs.get(2), true),
                Arguments.of(inputs.get(3), false)
        );
    }

    private static class BlankStringArgumentsProvider implements ArgumentsProvider {

        @Override
        public Stream<? extends Arguments> provideArguments(ExtensionContext context) throws Exception {
            return Stream.of(
                    Arguments.of((String) null),
                    Arguments.of(""),
                    Arguments.of(" ")
            );
        }
    }

    @ParameterizedTest
    @ArgumentsSource(BlankStringArgumentsProvider.class)
    void parameterizedTest_with_MethodSource_Using_ArgumentsProvider(String input) {
        assertThat(StringUtils.isBlank(input)).isTrue();
    }

    static Stream<Arguments> arguments = Stream.of(
            Arguments.of(null, true),
            Arguments.of("", true),
            Arguments.of(" ", true),
            Arguments.of("Not Empty", false)
    );

    private static class SlashyDateConverter implements ArgumentConverter {

        @Override
        public Object convert(Object source, ParameterContext context) throws ArgumentConversionException {
            if (!(source instanceof String)) {
                throw new IllegalArgumentException("문자열이 아닙니다. 입력값:" + source);
            }

            try {
                String[] parts = ((String) source).split("/");
                int year = Integer.parseInt(parts[0]);
                int month = Integer.parseInt(parts[1]);
                int day = Integer.parseInt(parts[2]);

                return LocalDate.of(year, month, day);
            } catch (NumberFormatException e) {
                e.printStackTrace();
                throw new IllegalArgumentException("숫자가 아닙니다. 입력값:" + source);
            }
        }
    }

    @ParameterizedTest
    @CsvSource({"2023/11/28", "2023/12/28"})
    void parameterizedTest_with_CustomConverter(@ConvertWith(SlashyDateConverter.class) LocalDate date) {
        assertThat(date.getYear()).isEqualTo(2023);
        assertThat(date.getMonth()).isGreaterThan(Month.OCTOBER);
        assertThat(date.getDayOfMonth()).isEqualTo(28);
    }

    @ParameterizedTest(name = "{index} - Parameter is {0}")
    @EnumSource(value = Direction.class, names = {"SOUTH", "NORTH"})
    void displayNameTest(Direction direction) {
    }
}
```

### 4. 두 객체 리스트의 필드 비교하기

```java
public class UsingRecursiveComparisonStudyTest {

    @Test
    void usingRecursiveComparisonTest_1() {
        List<Member> members = List.of(
                new Member(1, "backend developer"),
                new Member(2, "DBA"),
                new Member(3, "frontend developer")
        );

        List<Member> other = List.of(
                new Member(1, "DBA"),
                new Member(2, "frontend developer"),
                new Member(3, "backend developer")
        );

        assertThat(members).usingRecursiveComparison()
                .comparingOnlyFields("job")
                .ignoringCollectionOrder()
                .isEqualTo(other);
    }

    @Test
    void usingRecursiveComparisonTest_2() {
        Member member = new Member(1, "DBA");
        Member other = new Member(2, "DBA");

        assertThat(member).usingRecursiveComparison()
                .comparingOnlyFields("job")
                .isEqualTo(other);
    }
}
```

## 마치며

더 나은 방법이 있거나 제안이 있다면 언제든 댓글 달아주시면 감사하겠습니다!