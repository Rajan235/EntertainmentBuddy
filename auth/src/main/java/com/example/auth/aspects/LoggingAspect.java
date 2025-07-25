package com.example.auth.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;

import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Pointcut("execution(* com.example.auth.controller..*(..)) || execution(* com.example.auth.service..*(..))")
    public void applicationPackagePointcut() {}

    @Before("applicationPackagePointcut()")
    public void logBefore(JoinPoint joinPoint) {
        log.info("🔹 Enter: {}() with arguments = {}",
                 joinPoint.getSignature().toShortString(),
                 Arrays.toString(joinPoint.getArgs()));
    }

    @AfterReturning(pointcut = "applicationPackagePointcut()", returning = "result")
    public void logAfter(JoinPoint joinPoint, Object result) {
        log.info("✅ Exit: {}() with result = {}",
                 joinPoint.getSignature().toShortString(),
                 result);
    }

    @AfterThrowing(pointcut = "applicationPackagePointcut()", throwing = "ex")
    public void logException(JoinPoint joinPoint, Throwable ex) {
        log.error("❌ Exception in {}() with message = {}",
                  joinPoint.getSignature().toShortString(),
                  ex.getMessage(), ex);
    }
}
