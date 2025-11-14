// Questions Data
const quizQuestions = {
    it: [
        {
            question: "1. Who invented Java Programming?",
            options: ["a) Guido van Rossum", "b) James Gosling", "c) Dennis Ritchie", "d) Bjarne Stroustrup"],
            correct: 1
        },
        {
            question: "2. Which statement is true about Java?",
            options: ["a) Java is a sequence-dependent programming language", "b) Java is a code dependent programming language", "c) Java is a platform-dependent programming language", "d) Java is a platform-independent programming language"],
            correct: 3
        },
        {
            question: "3. Which component is used to compile, debug and execute the java programs?",
            options: ["a) JRE", "b) JIT", "c) JDK", "d) JVM"],
            correct: 2
        },
        {
            question: "4. Which one of the following is not a Java feature?",
            options: ["a) Object-oriented", "b) Use of pointers", "c) Portable", "d) Dynamic and Extensible"],
            correct: 1
        },
        {
            question: "5. Which of these cannot be used for a variable name in Java?",
            options: ["a) identifier & keyword", "b) identifier", "c) keyword", "d) none of the mentioned"],
            correct: 2
        },
        {
            question: "6. What is the extension of java code files?",
            options: ["a) .js", "b) .txt", "c) .class", "d) .java"],
            correct: 3
        },
        {
            question: "7. What will be the output of the following Java code?\nclass increment {\n    public static void main(String args[]) {\n        int g = 3;\n        System.out.print(++g * 8);\n    }\n}",
            options: ["a) 32", "b) 33", "c) 24", "d) 25"],
            correct: 0
        },
        {
            question: "8. Which environment variable is used to set the java path?",
            options: ["a) MAVEN_Path", "b) JavaPATH", "c) JAVA", "d) JAVA_HOME"],
            correct: 3
        },
        {
            question: "9. What will be the output of the following Java program?\nclass output {\n    public static void main(String args[]) {\n        double a, b, c;\n        a = 3.0/0;\n        b = 0/4.0;\n        c = 0/0.0;\n        System.out.println(a);\n        System.out.println(b);\n        System.out.println(c);\n    }\n}",
            options: ["a) NaN", "b) Infinity", "c) 0.0", "d) all of the mentioned"],
            correct: 3
        },
        {
            question: "10. Which of the following is not an OOPS concept in Java?",
            options: ["a) Polymorphism", "b) Inheritance", "c) Compilation", "d) Encapsulation"],
            correct: 2
        },
        {
            question: "11. What is not the use of 'this' keyword in Java?",
            options: ["a) Referring to the instance variable when a local variable has the same name", "b) Passing itself to the method of the same class", "c) Passing itself to another method", "d) Calling another constructor in constructor chaining"],
            correct: 1
        },
        {
            question: "12. What will be the output of the following Java program?\nclass variable_scope {\n    public static void main(String args[]) {\n        int x;\n        x = 5;\n        {\n            int y = 6;\n            System.out.print(x + ' ' + y);\n        }\n        System.out.println(x + ' ' + y);\n    }\n}",
            options: ["a) Compilation error", "b) Runtime error", "c) 5 6 5 6", "d) 5 6 5"],
            correct: 0
        },
        {
            question: "13. What will be the error in the following Java code?\nbyte b = 50;\nb = b * 50;",
            options: ["a) b cannot contain value 50", "b) b cannot contain value 100, limited by its range", "c) No error in this code", "d) * operator has converted b * 50 into int, which can not be converted to byte without casting"],
            correct: 3
        },
        {
            question: "14. Which of the following is a type of polymorphism in Java Programming?",
            options: ["a) Multiple polymorphism", "b) Compile time polymorphism", "c) Multilevel polymorphism", "d) Execution time polymorphism"],
            correct: 1
        },
        {
            question: "15. What will be the output of the following Java program?\nclass leftshift_operator {\n    public static void main(String args[]) {\n        byte x = 64;\n        int i;\n        byte y;\n        i = x << 2;\n        y = (byte) (x << 2)\n        System.out.print(i + ' ' + y);\n    }\n}",
            options: ["a) 0 256", "b) 0 64", "c) 256 0", "d) 64 0"],
            correct: 2
        },
        {
            question: "16. What will be the output of the following Java code?\nclass box {\n    int width;\n    int height;\n    int length;\n}\nclass main {\n    public static void main(String args[]) {\n        box obj = new box();\n        obj.width = 10;\n        obj.height = 2;\n        obj.length = 10;\n        int y = obj.width * obj.height * obj.length;\n        System.out.print(y);\n    }\n}",
            options: ["a) 100", "b) 400", "c) 200", "d) 12"],
            correct: 2
        },
        {
            question: "17. What is Truncation in Java?",
            options: ["a) Floating-point value assigned to a Floating type", "b) Floating-point value assigned to an integer type", "c) Integer value assigned to floating type", "d) Integer value assigned to integer type"],
            correct: 1
        },
        {
            question: "18. What will be the output of the following Java program?\nclass Output {\n    public static void main(String args[]) {\n        int arr[] = {1, 2, 3, 4, 5};\n        for (int i = 0; i < arr.length - 2; ++i)\n            System.out.println(arr[i] + ' ');\n    }\n}",
            options: ["a) 1 2 3 4 5", "b) 1 2 3 4", "c) 1 2", "d) 1 2 3"],
            correct: 3
        },
        {
            question: "19. What will be the output of the following Java code snippet?\nclass abc {\n    public static void main(String args[]) {\n        if(args.length>0)\n            System.out.println(args.length);\n    }\n}",
            options: ["a) The snippet compiles and runs but does not print anything", "b) The snippet compiles, runs and prints 0", "c) The snippet compiles, runs and prints 1", "d) The snippet does not compile"],
            correct: 0
        },
        {
            question: "20. What is the extension of compiled java classes?",
            options: ["a) .txt", "b) .js", "c) .class", "d) .java"],
            correct: 2
        },
        {
            question: "21. Which exception is thrown when java is out of memory?",
            options: ["a) MemoryError", "b) OutOfMemoryError", "c) MemoryOutOfBoundsException", "d) MemoryFullException"],
            correct: 1
        },
        {
            question: "22. What will be the output of the following Java code?\nclass String_demo {\n    public static void main(String args[]) {\n        char chars[] = {'a', 'b', 'c'};\n        String s = new String(chars);\n        System.out.println(s);\n    }\n}",
            options: ["a) abc", "b) a", "c) b", "d) c"],
            correct: 0
        },
        {
            question: "23. Which of these are selection statements in Java?",
            options: ["a) break", "b) continue", "c) for()", "d) if()"],
            correct: 3
        },
        {
            question: "24. What will be the output of the following Java program?\nclass recursion {\n    int func (int n) {\n        int result;\n        if (n == 1)\n            return 1;\n        result = func (n - 1);\n        return result;\n    }\n}\nclass Output {\n    public static void main(String args[]) {\n        recursion obj = new recursion();\n        System.out.print(obj.func(5));\n    }\n}",
            options: ["a) 1", "b) 120", "c) 0", "d) None of the mentioned"],
            correct: 0
        },
        {
            question: "25. What will be the output of the following Java code?\nclass output {\n    public static void main(String args[]) {\n        String c = 'Hello i love java';\n        boolean var;\n        var = c.startsWith('hello');\n        System.out.println(var);\n    }\n}",
            options: ["a) 0", "b) true", "c) 1", "d) false"],
            correct: 3
        },
        {
            question: "26. Which of these keywords is used to define interfaces in Java?",
            options: ["a) intf", "b) Intf", "c) interface", "d) Interface"],
            correct: 2
        },
        {
            question: "27. What will be the output of the following Java program?\nclass output {\n    public static void main(String args[]) {\n        StringBuffer s1 = new StringBuffer('Quiz');\n        StringBuffer s2 = s1.reverse();\n        System.out.println(s2);\n    }\n}",
            options: ["a) QuizziuQ", "b) ziuQQuiz", "c) Quiz", "d) ziuQ"],
            correct: 3
        },
        {
            question: "28. What will be the output of the following Java code?\nclass Output {\n    public static void main(String args[]) {\n        Integer i = new Integer(257);\n        byte x = i.byteValue();\n        System.out.print(x);\n    }\n}",
            options: ["a) 257", "b) 256", "c) 1", "d) 0"],
            correct: 2
        },
        {
            question: "29. What will be the output of the following Java program?\nclass Output {\n    public static void main(String args[]) {\n        double x = 2.0;\n        double y = 3.0;\n        double z = Math.pow(x, y);\n        System.out.print(z);\n    }\n}",
            options: ["a) 9.0", "b) 8.0", "c) 4.0", "d) 2.0"],
            correct: 1
        },
        {
            question: "30. Which of the following is a superclass of every class in Java?",
            options: ["a) ArrayList", "b) Abstract class", "c) Object class", "d) String"],
            correct: 2
        },
        {
            question: "31. What will be the output of the following Java code?\nclass Output {\n    public static void main(String args[]) {\n        double x = 3.14;\n        int y = (int) Math.ceil(x);\n        System.out.print(y);\n    }\n}",
            options: ["a) 3", "b) 0", "c) 4", "d) 3.0"],
            correct: 2
        },
        {
            question: "32. What will be the output of the following Java program?\nimport java.net.*;\nclass networking {\n    public static void main(String[] args) throws Exception {\n        URL obj = new URL('https://www.sanfoundry.com/javamcq');\n        URLConnection obj1 = obj.openConnection();\n        int len = obj1.getContentLength();\n        System.out.print(len);\n    }\n}\nNote: Host URL is having length of content 127.",
            options: ["a) 127", "b) 126", "c) Runtime Error", "d) Compilation Error"],
            correct: 0
        },
        {
            question: "33. Which of the below is not a Java Profiler?",
            options: ["a) JProfiler", "b) Eclipse Profiler", "c) JVM", "d) JConsole"],
            correct: 2
        },
        {
            question: "34. What will be the output of the following Java program?\nimport java.net.*;\nclass networking {\n    public static void main(String[] args) throws MalformedURLException {\n        URL obj = new URL('https://www.sanfoundry.com/javamcq');\n        System.out.print(obj.toExternalForm());\n    }\n}",
            options: ["a) www.sanfoundry.com", "b) https://www.sanfoundry.com/javamcq", "c) sanfoundry", "d) sanfoundry.com"],
            correct: 1
        },
        {
            question: "35. What will be the output of the following Java code snippet?\nimport java.util.*;\nclass Arraylists {\n    public static void main(String args[]) {\n        ArrayLists obj = new ArrayLists();\n        obj.add('A');\n        obj.add('B');\n        obj.add('C');\n        obj.add(1, 'D');\n        System.out.println(obj);\n    }\n}",
            options: ["a) [A, D, C]", "b) [A, B, C]", "c) [A, B, C, D]", "d) [A, D, B, C]"],
            correct: 3
        },
        {
            question: "36. Which of these packages contains the exception Stack Overflow in Java?",
            options: ["a) java.io", "b) java.system", "c) java.lang", "d) java.util"],
            correct: 2
        },
        {
            question: "37. What will be the output of the following Java program?\nimport java.util.*;\nclass Collection_iterators {\n    public static void main(String args[]) {\n        LinkedList list = new LinkedList();\n        list.add(new Integer(2));\n        list.add(new Integer(8));\n        list.add(new Integer(5));\n        list.add(new Integer(1));\n        Iterator i = list.iterator();\n        Collections.reverse(list);\n        Collections.sort(list);\n        while(i.hasNext())\n            System.out.print(i.next() + ' ');\n    }\n}",
            options: ["a) 1 2 5 8", "b) 2 1 8 5", "c) 1 5 8 2", "d) 2 8 5 1"],
            correct: 3
        },
        {
            question: "38. Which of these statements is incorrect about Thread?",
            options: ["a) start() method is used to begin execution of the thread", "b) run() method is used to begin execution of a thread before start() method in special cases", "c) A thread can be formed by implementing Runnable interface only", "d) A thread can be formed by a class that extends Thread class"],
            correct: 2
        },
        {
            question: "39. Which of these keywords are used for the block to be examined for exceptions?",
            options: ["a) check", "b) throw", "c) catch", "d) try"],
            correct: 3
        },
        {
            question: "40. What will be the output of the following Java code?\nclass newthread extends Thread {\n    Thread t;\n    newthread() {\n        t1 = new Thread(this,'Thread_1');\n        t2 = new Thread(this,'Thread_2');\n        t1.start();\n        t2.start();\n    }\n    public void run() {\n        t2.setPriority(Thread.MAX_PRIORITY);\n        System.out.print(t1.equals(t2));\n    }\n}\nclass multithreaded_programing {\n    public static void main(String args[]) {\n        new newthread();\n    }\n}",
            options: ["a) truetrue", "b) falsefalse", "c) true", "d) false"],
            correct: 1
        }
    ],
    accounts: [
        {
            question: "1. Insurance payment account is a",
            options: ["a) Nominal account", "b) Representative personal account", "c) Real account", "d) Artificial personal account"],
            correct: 1
        },
        {
            question: "2. According to --------- concept, the same method of accounting is to be followed year after year",
            options: ["a) Going concern", "b) Entry", "c) Consistency", "d) Cost"],
            correct: 2
        },
        {
            question: "3. Accounting is",
            options: ["a) A Science", "b) An Art", "c) Both Science and Art", "d) None"],
            correct: 2
        },
        {
            question: "4. Who invented the Double Entry System of Book Keeping?",
            options: ["a) William Pickles", "b) Lucas Piccioli", "c) J.R. Batliboi", "d) None of the above"],
            correct: 1
        },
        {
            question: "5. Which of the following transactions are not financial character and will be recorded in the books?",
            options: ["a) Make promise to send the goods", "b) Receiving an order to send the goods", "c) Loss of goods by fire", "d) Interviewing the candidates for employment"],
            correct: 2
        },
        {
            question: "6. In accounts recording is made of",
            options: ["a) Only Financial Transaction", "b) Only Non-financial transaction", "c) Financial and non-financial transaction", "d) Personal transaction of the Proprietor"],
            correct: 0
        },
        {
            question: "7. Entry made on both sides of cash book is called",
            options: ["a) Double entry", "b) Compound entry", "c) Contra entry", "d) Mixed entry"],
            correct: 2
        },
        {
            question: "8. Petty cash book is a branch of",
            options: ["a) Sales book", "b) Pass book", "c) Cash book", "d) Purchase book"],
            correct: 2
        },
        {
            question: "9. A bill of exchange is accepted by",
            options: ["a) Drawer", "b) Drawee", "c) Payee", "d) Bank"],
            correct: 1
        },
        {
            question: "10. The modern system of book keeping is based on",
            options: ["a) Double account system", "b) Single entry system", "c) Single account system", "d) Double entry system"],
            correct: 3
        },
        {
            question: "11. Which of the following book is called the book of original entry",
            options: ["a) Cash book", "b) Capital loss", "c) Journal", "d) Revenue loss"],
            correct: 2
        },
        {
            question: "12. Which of the following is not a financing activity?",
            options: ["a) Repayment of long-term debt", "b) Issuance of equity", "c) Investments in businesses", "d) Payment of dividends"],
            correct: 2
        },
        {
            question: "13. What is working capital?",
            options: ["a) Equity Capital + Retained Earnings", "b) Equity Capital – Total Liabilities", "c) Total Assets – Total Liabilities", "d) Current Assets – Current Liabilities"],
            correct: 3
        },
        {
            question: "14. Which of the following is not true about goodwill?",
            options: ["a) Goodwill needs to be evaluated for impairment yearly", "b) Goodwill is treated as a tangible asset in accounting", "c) Goodwill is a result of purchasing a company for a price higher than the fair market value", "d) Goodwill can be comprised of things such as good reputation, loyal client base"],
            correct: 1
        },
        {
            question: "15. Excess of debit over credit is called",
            options: ["a) Credit balance", "b) Debit balance", "c) Opening balance", "d) Closing balance"],
            correct: 1
        },
        {
            question: "16. The excess of assets over liabilities is",
            options: ["a) Revenue", "b) Profit", "c) Loss", "d) Capital"],
            correct: 3
        },
        {
            question: "17. A bill of exchange contains",
            options: ["a) A promise", "b) An unconditional order", "c) A conditional order", "d) A request to deliver goods"],
            correct: 1
        },
        {
            question: "18. Wages paid to workers for erection of machinery are",
            options: ["a) Revenue expenditure", "b) Capital expenditure", "c) Capital loss", "d) Revenue loss"],
            correct: 1
        },
        {
            question: "19. Withdrawal of merchandise for personal use is",
            options: ["a) Drawings", "b) Sale of merchandise", "c) Personal expenses", "d) Charity"],
            correct: 0
        },
        {
            question: "20. If business assets are more than its liabilities, this position is known as",
            options: ["a) Insolvency", "b) Solvency", "c) Both (a) and (b)", "d) Loan position"],
            correct: 1
        },
        {
            question: "21. Which of the following it not a current asset?",
            options: ["a) Cash", "b) Bank", "c) Debtor", "d) Machinery"],
            correct: 3
        },
        {
            question: "22. Which of the following transaction is not of financial character?",
            options: ["a) Purchase of asset on credit", "b) Purchase of asset for cash", "c) Withdrawing of money by proprietor from business", "d) Strike by employees"],
            correct: 3
        },
        {
            question: "23. Internal users of accounting information are",
            options: ["a) Potential Investors", "b) Creditors", "c) Bank", "d) Employees"],
            correct: 3
        },
        {
            question: "24. ABC Ltd, follows straight line method of depreciation on fixed asset year after year by applying the principle of",
            options: ["a) Comparability", "b) Convenience", "c) Consistency", "d) All of the above"],
            correct: 2
        },
        {
            question: "25. Purchase book records",
            options: ["a) All cash purchases", "b) All credit purchases of goods in trade only", "c) None of the above", "d) All credit purchased of goods and assets"],
            correct: 1
        },
        {
            question: "26. Matching concept is related to",
            options: ["a) Assets= Capital + Liabilities", "b) Follow same method of accounting year after year", "c) Accruals should be recorded", "d) Revenue earned in the period should be matched with the expenses of that period"],
            correct: 3
        },
        {
            question: "27. The concept of present value relates to the idea that",
            options: ["a) The discount rate is always higher when you invest now than in the future", "b) The discount rate is always higher when you invest in the future than now", "c) The money you have now is worth less today than an identical amount you would receive in the future", "d) The money you have now is worth more today than an identical amount you would receive in the future"],
            correct: 3
        },
        {
            question: "28. A person who owes money is",
            options: ["a) A creditor", "b) An Owner", "c) A Debtor", "d) Agent"],
            correct: 2
        },
        {
            question: "29. The basic objective of financial management is",
            options: ["a) Maximization of profits", "b) Profit planning of the organization", "c) Maximization of shareholders wealth", "d) Ensuring financial disciplined in the organization"],
            correct: 2
        },
        {
            question: "30. What is an annuity?",
            options: ["a) An investment that has no definite end and a stream of cash payments that continue forever", "b) A stream of cash flows that start one year from today and continue while growing by a constant growth rate", "c) A series of equal payments at equal time periods and guaranteed for a fixed number of years", "d) A series of unequal payments at equal time periods which are guaranteed for a fixed number of years"],
            correct: 2
        },
        {
            question: "31. Cost of capital from all the sources of funds is called",
            options: ["a) Specific cost", "b) Composite cost", "c) Implicit cost", "d) Simple average cost"],
            correct: 1
        },
        {
            question: "32. What is a par value of a bond?",
            options: ["a) The amount borrowed by the issuer of the bond and returned to the investors when the bond matures", "b) The overall return earned by the bond investor when the bond matures", "c) The difference between the amount borrowed by the issuer of bond and the amount returned to investors at maturity", "d) The size of the coupon investors receives on an annual basis"],
            correct: 0
        },
        {
            question: "33. When the price of a bond is above the face value, the bond is said to be",
            options: ["a) Trading at par", "b) Trading at a premium", "c) Trading at a discount", "d) Trading below par"],
            correct: 1
        },
        {
            question: "34. Prepaid expenses should appear in",
            options: ["a) Stores", "b) Revenues", "c) Assets", "d) Liabilities"],
            correct: 2
        },
        {
            question: "35. The concept of time value of money is that",
            options: ["a) The cash flows that occur earlier are more valuable than cash flows that occur later", "b) The cash flows that occur earlier are less valuable than cash flows that occur later", "c) The longer the time cash flows are invested, the more valuable they are in the future", "d) The future value of cash flows is always higher than the present value of the cash flows"],
            correct: 0
        },
        {
            question: "36. Rent paid to landlord is debited to",
            options: ["a) Land lord A/c", "b) Purchase A/c", "c) Cash A/c", "d) Rent A/c"],
            correct: 3
        },
        {
            question: "37. Book keeping means",
            options: ["a) To keep the books", "b) To keep the books in office", "c) To maintain business transaction in books", "d) None of the above"],
            correct: 2
        },
        {
            question: "38. Capital is increased by profit and decreased by loss.",
            options: ["a) True", "b) False"],
            correct: 0
        },
        {
            question: "39. Accounting records only those transactions which can be express in terms of money",
            options: ["a) True", "b) False"],
            correct: 0
        },
        {
            question: "40. Lucas Piccioli is said to be father of Book Keeping",
            options: ["a) True", "b) False"],
            correct: 0
        }
    ]
};

export default quizQuestions;
