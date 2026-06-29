┌─────┬──────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  #  │   Severity   │                                                                         Change                                                                         │
├─────┼──────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1   │ Critical     │ Race condition: this.scannerControls.stop() → ctrls?.stop() in fatal-error callback (controls not yet assigned when callback fires)                   │
├─────┼──────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2   │ Critical     │ permissionResponse.error(err) removed — calling .error() on a Subject permanently terminates it, silencing all future next() emissions                │
├─────┼──────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3   │ Critical     │ controls.switchTorch(onOff) → .catch(() => {}) added to handle unhandled Promise rejection                                                            │
├─────┼──────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4   │ Performance  │ BehaviorSubject<ResultAndError>({}) → Subject<ResultAndError>() — eliminates spurious scanFailure/scanComplete events emitted on every scan start     │
├─────┼──────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 5   │ Performance  │ subscribe(next, error, complete) positional form → subscribe({ next, error }) object form — removes deprecated overload and no-op callback allocation │
├─────┼──────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 6   │ Code quality │ stream = undefined removed from terminateStream() — was a dead local reassignment with no effect on the caller                                        │
├─────┼──────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 7   │ Code quality │ Removed stale commented-out permissionResponse.pipe(...) block from device setter                                                                     │
├─────┼──────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 8   │ Mobile       │ Added playsinline to <video> — without it, iOS Safari forces fullscreen instead of inline playback                                                    │
├─────┼──────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 9   │  API           │ ResultAndError exported from public_api.ts — consumers can now properly type their scan handlers                                                      │
└─────┴──────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
