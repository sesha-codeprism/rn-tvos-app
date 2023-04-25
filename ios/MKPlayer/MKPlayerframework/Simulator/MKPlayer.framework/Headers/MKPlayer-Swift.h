#if 0
#elif defined(__x86_64__) && __x86_64__
// Generated by Apple Swift version 5.7.2 (swiftlang-5.7.2.135.5 clang-1400.0.29.51)
#ifndef MKPLAYER_SWIFT_H
#define MKPLAYER_SWIFT_H
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wgcc-compat"

#if !defined(__has_include)
# define __has_include(x) 0
#endif
#if !defined(__has_attribute)
# define __has_attribute(x) 0
#endif
#if !defined(__has_feature)
# define __has_feature(x) 0
#endif
#if !defined(__has_warning)
# define __has_warning(x) 0
#endif

#if __has_include(<swift/objc-prologue.h>)
# include <swift/objc-prologue.h>
#endif

#pragma clang diagnostic ignored "-Wduplicate-method-match"
#pragma clang diagnostic ignored "-Wauto-import"
#if defined(__OBJC__)
#include <Foundation/Foundation.h>
#endif
#if defined(__cplusplus)
#include <cstdint>
#include <cstddef>
#include <cstdbool>
#else
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>
#endif

#if !defined(SWIFT_TYPEDEFS)
# define SWIFT_TYPEDEFS 1
# if __has_include(<uchar.h>)
#  include <uchar.h>
# elif !defined(__cplusplus)
typedef uint_least16_t char16_t;
typedef uint_least32_t char32_t;
# endif
typedef float swift_float2  __attribute__((__ext_vector_type__(2)));
typedef float swift_float3  __attribute__((__ext_vector_type__(3)));
typedef float swift_float4  __attribute__((__ext_vector_type__(4)));
typedef double swift_double2  __attribute__((__ext_vector_type__(2)));
typedef double swift_double3  __attribute__((__ext_vector_type__(3)));
typedef double swift_double4  __attribute__((__ext_vector_type__(4)));
typedef int swift_int2  __attribute__((__ext_vector_type__(2)));
typedef int swift_int3  __attribute__((__ext_vector_type__(3)));
typedef int swift_int4  __attribute__((__ext_vector_type__(4)));
typedef unsigned int swift_uint2  __attribute__((__ext_vector_type__(2)));
typedef unsigned int swift_uint3  __attribute__((__ext_vector_type__(3)));
typedef unsigned int swift_uint4  __attribute__((__ext_vector_type__(4)));
#endif

#if !defined(SWIFT_PASTE)
# define SWIFT_PASTE_HELPER(x, y) x##y
# define SWIFT_PASTE(x, y) SWIFT_PASTE_HELPER(x, y)
#endif
#if !defined(SWIFT_METATYPE)
# define SWIFT_METATYPE(X) Class
#endif
#if !defined(SWIFT_CLASS_PROPERTY)
# if __has_feature(objc_class_property)
#  define SWIFT_CLASS_PROPERTY(...) __VA_ARGS__
# else
#  define SWIFT_CLASS_PROPERTY(...)
# endif
#endif

#if __has_attribute(objc_runtime_name)
# define SWIFT_RUNTIME_NAME(X) __attribute__((objc_runtime_name(X)))
#else
# define SWIFT_RUNTIME_NAME(X)
#endif
#if __has_attribute(swift_name)
# define SWIFT_COMPILE_NAME(X) __attribute__((swift_name(X)))
#else
# define SWIFT_COMPILE_NAME(X)
#endif
#if __has_attribute(objc_method_family)
# define SWIFT_METHOD_FAMILY(X) __attribute__((objc_method_family(X)))
#else
# define SWIFT_METHOD_FAMILY(X)
#endif
#if __has_attribute(noescape)
# define SWIFT_NOESCAPE __attribute__((noescape))
#else
# define SWIFT_NOESCAPE
#endif
#if __has_attribute(ns_consumed)
# define SWIFT_RELEASES_ARGUMENT __attribute__((ns_consumed))
#else
# define SWIFT_RELEASES_ARGUMENT
#endif
#if __has_attribute(warn_unused_result)
# define SWIFT_WARN_UNUSED_RESULT __attribute__((warn_unused_result))
#else
# define SWIFT_WARN_UNUSED_RESULT
#endif
#if __has_attribute(noreturn)
# define SWIFT_NORETURN __attribute__((noreturn))
#else
# define SWIFT_NORETURN
#endif
#if !defined(SWIFT_CLASS_EXTRA)
# define SWIFT_CLASS_EXTRA
#endif
#if !defined(SWIFT_PROTOCOL_EXTRA)
# define SWIFT_PROTOCOL_EXTRA
#endif
#if !defined(SWIFT_ENUM_EXTRA)
# define SWIFT_ENUM_EXTRA
#endif
#if !defined(SWIFT_CLASS)
# if __has_attribute(objc_subclassing_restricted)
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# else
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# endif
#endif
#if !defined(SWIFT_RESILIENT_CLASS)
# if __has_attribute(objc_class_stub)
#  define SWIFT_RESILIENT_CLASS(SWIFT_NAME) SWIFT_CLASS(SWIFT_NAME) __attribute__((objc_class_stub))
#  define SWIFT_RESILIENT_CLASS_NAMED(SWIFT_NAME) __attribute__((objc_class_stub)) SWIFT_CLASS_NAMED(SWIFT_NAME)
# else
#  define SWIFT_RESILIENT_CLASS(SWIFT_NAME) SWIFT_CLASS(SWIFT_NAME)
#  define SWIFT_RESILIENT_CLASS_NAMED(SWIFT_NAME) SWIFT_CLASS_NAMED(SWIFT_NAME)
# endif
#endif

#if !defined(SWIFT_PROTOCOL)
# define SWIFT_PROTOCOL(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
# define SWIFT_PROTOCOL_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
#endif

#if !defined(SWIFT_EXTENSION)
# define SWIFT_EXTENSION(M) SWIFT_PASTE(M##_Swift_, __LINE__)
#endif

#if !defined(OBJC_DESIGNATED_INITIALIZER)
# if __has_attribute(objc_designated_initializer)
#  define OBJC_DESIGNATED_INITIALIZER __attribute__((objc_designated_initializer))
# else
#  define OBJC_DESIGNATED_INITIALIZER
# endif
#endif
#if !defined(SWIFT_ENUM_ATTR)
# if defined(__has_attribute) && __has_attribute(enum_extensibility)
#  define SWIFT_ENUM_ATTR(_extensibility) __attribute__((enum_extensibility(_extensibility)))
# else
#  define SWIFT_ENUM_ATTR(_extensibility)
# endif
#endif
#if !defined(SWIFT_ENUM)
# define SWIFT_ENUM(_type, _name, _extensibility) enum _name : _type _name; enum SWIFT_ENUM_ATTR(_extensibility) SWIFT_ENUM_EXTRA _name : _type
# if __has_feature(generalized_swift_name)
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME, _extensibility) enum _name : _type _name SWIFT_COMPILE_NAME(SWIFT_NAME); enum SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_ENUM_ATTR(_extensibility) SWIFT_ENUM_EXTRA _name : _type
# else
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME, _extensibility) SWIFT_ENUM(_type, _name, _extensibility)
# endif
#endif
#if !defined(SWIFT_UNAVAILABLE)
# define SWIFT_UNAVAILABLE __attribute__((unavailable))
#endif
#if !defined(SWIFT_UNAVAILABLE_MSG)
# define SWIFT_UNAVAILABLE_MSG(msg) __attribute__((unavailable(msg)))
#endif
#if !defined(SWIFT_AVAILABILITY)
# define SWIFT_AVAILABILITY(plat, ...) __attribute__((availability(plat, __VA_ARGS__)))
#endif
#if !defined(SWIFT_WEAK_IMPORT)
# define SWIFT_WEAK_IMPORT __attribute__((weak_import))
#endif
#if !defined(SWIFT_DEPRECATED)
# define SWIFT_DEPRECATED __attribute__((deprecated))
#endif
#if !defined(SWIFT_DEPRECATED_MSG)
# define SWIFT_DEPRECATED_MSG(...) __attribute__((deprecated(__VA_ARGS__)))
#endif
#if __has_feature(attribute_diagnose_if_objc)
# define SWIFT_DEPRECATED_OBJC(Msg) __attribute__((diagnose_if(1, Msg, "warning")))
#else
# define SWIFT_DEPRECATED_OBJC(Msg) SWIFT_DEPRECATED_MSG(Msg)
#endif
#if defined(__OBJC__)
#if !defined(IBSegueAction)
# define IBSegueAction
#endif
#endif
#if !defined(SWIFT_EXTERN)
# if defined(__cplusplus)
#  define SWIFT_EXTERN extern "C"
# else
#  define SWIFT_EXTERN extern
# endif
#endif
#if !defined(SWIFT_CALL)
# define SWIFT_CALL __attribute__((swiftcall))
#endif
#if defined(__cplusplus)
#if !defined(SWIFT_NOEXCEPT)
# define SWIFT_NOEXCEPT noexcept
#endif
#else
#if !defined(SWIFT_NOEXCEPT)
# define SWIFT_NOEXCEPT 
#endif
#endif
#if defined(__cplusplus)
#if !defined(SWIFT_CXX_INT_DEFINED)
#define SWIFT_CXX_INT_DEFINED
namespace swift {
using Int = ptrdiff_t;
using UInt = size_t;
}
#endif
#endif
#if defined(__OBJC__)
#if __has_feature(modules)
#if __has_warning("-Watimport-in-framework-header")
#pragma clang diagnostic ignored "-Watimport-in-framework-header"
#endif
@import BitmovinPlayer;
@import ObjectiveC;
#endif

#endif
#pragma clang diagnostic ignored "-Wproperty-attribute-mismatch"
#pragma clang diagnostic ignored "-Wduplicate-method-arg"
#if __has_warning("-Wpragma-clang-attribute")
# pragma clang diagnostic ignored "-Wpragma-clang-attribute"
#endif
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma clang diagnostic ignored "-Wnullability"
#pragma clang diagnostic ignored "-Wdollar-in-identifier-extension"

#if __has_attribute(external_source_symbol)
# pragma push_macro("any")
# undef any
# pragma clang attribute push(__attribute__((external_source_symbol(language="Swift", defined_in="MKPlayer",generated_declaration))), apply_to=any(function,enum,objc_interface,objc_category,objc_protocol))
# pragma pop_macro("any")
#endif

#if defined(__OBJC__)


/// Defines AdBreak start/end position, duration and id.
SWIFT_CLASS("_TtC8MKPlayer10MKPAdBreak")
@interface MKPAdBreak : NSObject
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Base class for all the event classes.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer8MKPEvent")
@interface MKPEvent : NSObject
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Base class for the Ad event classes.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer10MKPAdEvent")
@interface MKPAdEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onAdBreakStarted event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer22MKPAdBreakStartedEvent")
@interface MKPAdBreakStartedEvent : MKPAdEvent
@end



/// Defines the event data that will be received as part of the onAdFinished event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer18MKPAdFinishedEvent")
@interface MKPAdFinishedEvent : MKPAdEvent
@end


/// Defines the event data that will be received as part of the onAdQuartileEvent.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer18MKPAdQuartileEvent")
@interface MKPAdQuartileEvent : MKPAdEvent
@end


/// Defines the event data that will be received as part of the onAdStarted event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer17MKPAdStartedEvent")
@interface MKPAdStartedEvent : MKPAdEvent
@end


/// Adobe Primetime config values which can be used which can be used to pass it down to Azuki as part of roll call.
SWIFT_CLASS("_TtC8MKPlayer30MKPAdobePrimetimeConfiguration")
@interface MKPAdobePrimetimeConfiguration : NSObject
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


SWIFT_CLASS("_TtC8MKPlayer24MKPAdobePrimetimeManager")
@interface MKPAdobePrimetimeManager : NSObject
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onAirPlayAvailable event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer24MKPAirPlayAvailableEvent")
@interface MKPAirPlayAvailableEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onAirPlayChanged event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer22MKPAirPlayChangedEvent")
@interface MKPAirPlayChangedEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onAudioChangedEvent event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer20MKPAudioChangedEvent")
@interface MKPAudioChangedEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Base class for all track classes.
SWIFT_CLASS("_TtC8MKPlayer8MKPTrack")
@interface MKPTrack : NSObject
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the audio track related parameters.
SWIFT_CLASS("_TtC8MKPlayer13MKPAudioTrack")
@interface MKPAudioTrack : MKPTrack
@end


/// Defines the object containing metadata.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer11MKPMetadata")
@interface MKPMetadata : NSObject
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the object that represents timed metadata in-playlist.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer20MKPDaterangeMetadata")
@interface MKPDaterangeMetadata : MKPMetadata
@end


/// Defines the event data that will be received as part of the onDurationChanged event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer23MKPDurationChangedEvent")
@interface MKPDurationChangedEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onDvrWindowExceeded event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer25MKPDvrWindowExceededEvent")
@interface MKPDvrWindowExceededEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onError event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
/// Please see the documentation for <a href="../Protocols/MKPError.html">MKPError</a> for details on the different error codes and error messages.
SWIFT_CLASS("_TtC8MKPlayer13MKPErrorEvent")
@interface MKPErrorEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end



/// Defines the object that represents ID3 metadata found in the stream..
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer14MKPId3Metadata")
@interface MKPId3Metadata : MKPMetadata
@end



/// Defines the event data that will be received as part of the onMetadata event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer16MKPMetadataEvent")
@interface MKPMetadataEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onMetadataParsed event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer22MKPMetadataParsedEvent")
@interface MKPMetadataParsedEvent : MKPMetadataEvent
@end


/// Defines the event data that will be received as part of onMuted event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer13MKPMutedEvent")
@interface MKPMutedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onPaused event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer14MKPPausedEvent")
@interface MKPPausedEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onPictureInPictureEnter event.
/// Please see the documentation for <a href="../Protocols/MKPPictureInPictureDelegate.html">MKPPictureInPictureDelegate</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer29MKPPictureInPictureEnterEvent")
@interface MKPPictureInPictureEnterEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onPictureInPictureEntered event.
/// Please see the documentation for <a href="../Protocols/MKPPictureInPictureDelegate.html">MKPPictureInPictureDelegate</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer31MKPPictureInPictureEnteredEvent")
@interface MKPPictureInPictureEnteredEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onPictureInPictureExit event.
/// Please see the documentation for <a href="../Protocols/MKPPictureInPictureDelegate.html">MKPPictureInPictureDelegate</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer28MKPPictureInPictureExitEvent")
@interface MKPPictureInPictureExitEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onPictureInPictureExited event.
/// Please see the documentation for <a href="../Protocols/MKPPictureInPictureDelegate.html">MKPPictureInPictureDelegate</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer30MKPPictureInPictureExitedEvent")
@interface MKPPictureInPictureExitedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onPlay event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer12MKPPlayEvent")
@interface MKPPlayEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onPlaybackFinished event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer24MKPPlaybackFinishedEvent")
@interface MKPPlaybackFinishedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// MKPlayer event dispatcher.
SWIFT_CLASS("_TtC8MKPlayer24MKPPlayerEventDispatcher")
@interface MKPPlayerEventDispatcher : NSObject
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end



@class BMPSourceErrorEvent;
@protocol BMPPlayer;
@class BMPPlayerErrorEvent;
@class BMPMutedEvent;
@class BMPPausedEvent;
@class BMPPlayEvent;
@class BMPPlaybackFinishedEvent;
@class BMPPlayingEvent;
@class BMPReadyEvent;
@class BMPSeekEvent;
@class BMPSeekedEvent;
@class BMPSourceLoadedEvent;
@class BMPSourceUnloadedEvent;
@class BMPUnmutedEvent;
@class BMPTimeChangedEvent;
@class BMPDurationChangedEvent;
@class BMPMetadataEvent;
@class BMPMetadataParsedEvent;
@class BMPTimeShiftEvent;
@class BMPTimeShiftedEvent;
@class BMPStallStartedEvent;
@class BMPStallEndedEvent;
@class BMPVideoSizeChangedEvent;
@class BMPSubtitleChangedEvent;
@class BMPAudioChangedEvent;
@class BMPVideoDownloadQualityChangedEvent;
@class BMPSharePlayStartedEvent;
@class BMPSharePlayEndedEvent;
@class BMPSharePlaySuspensionStartedEvent;
@class BMPSharePlaySuspensionEndedEvent;

@interface MKPPlayerEventDispatcher (SWIFT_EXTENSION(MKPlayer)) <BMPPlayerListener>
/// :nodoc:
- (void)onSourceError:(BMPSourceErrorEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
- (void)onPlayerError:(BMPPlayerErrorEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onMuted:(BMPMutedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onPaused:(BMPPausedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onPlay:(BMPPlayEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onPlaybackFinished:(BMPPlaybackFinishedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onPlaying:(BMPPlayingEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onReady:(BMPReadyEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onSeek:(BMPSeekEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onSeeked:(BMPSeekedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onSourceLoaded:(BMPSourceLoadedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onSourceUnloaded:(BMPSourceUnloadedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onUnmuted:(BMPUnmutedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onTimeChanged:(BMPTimeChangedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onDurationChanged:(BMPDurationChangedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onMetadata:(BMPMetadataEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onMetadataParsed:(BMPMetadataParsedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onTimeShift:(BMPTimeShiftEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onTimeShifted:(BMPTimeShiftedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onStallStarted:(BMPStallStartedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onStallEnded:(BMPStallEndedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onVideoSizeChanged:(BMPVideoSizeChangedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onSubtitleChanged:(BMPSubtitleChangedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onAudioChanged:(BMPAudioChangedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onVideoDownloadQualityChanged:(BMPVideoDownloadQualityChangedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onSharePlayStarted:(BMPSharePlayStartedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player SWIFT_AVAILABILITY(tvos,introduced=15.0) SWIFT_AVAILABILITY(ios,introduced=15.0);
/// :nodoc:
- (void)onSharePlayEnded:(BMPSharePlayEndedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player SWIFT_AVAILABILITY(tvos,introduced=15.0) SWIFT_AVAILABILITY(ios,introduced=15.0);
/// :nodoc:
- (void)onSharePlaySuspensionStarted:(BMPSharePlaySuspensionStartedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player SWIFT_AVAILABILITY(tvos,introduced=15.0) SWIFT_AVAILABILITY(ios,introduced=15.0);
/// :nodoc:
- (void)onSharePlaySuspensionEnded:(BMPSharePlaySuspensionEndedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player SWIFT_AVAILABILITY(tvos,introduced=15.0) SWIFT_AVAILABILITY(ios,introduced=15.0);
@end


/// Defines the event data that will be received as part of the onPlaying event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer15MKPPlayingEvent")
@interface MKPPlayingEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onProgramRestrictions event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer27MKPProgramRestrictionsEvent")
@interface MKPProgramRestrictionsEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onProgramTimeChanged event.
/// This event returns the <a href="../Structs/MKPTimeRange.html">MKPTimeRange</a> currently valid for the current Live program, where
/// <ul>
///   <li>
///     <code>start</code>: The current Live program start time represented as a Unix timestamp.
///   </li>
///   <li>
///     <code>end</code>: The current Live program end time represented as a Unix timestamp.
///   </li>
///   <li>
///     <code>duration</code>: The current Live program duration represented in number of seconds.
///   </li>
/// </ul>
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer26MKPProgramTimeChangedEvent")
@interface MKPProgramTimeChangedEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onReady event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer13MKPReadyEvent")
@interface MKPReadyEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onScalingModeChanged event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer26MKPScalingModeChangedEvent")
@interface MKPScalingModeChangedEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the object that represents the SCTE-35 metadata from the media playlist.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer15MKPScteMetadata")
@interface MKPScteMetadata : MKPMetadata
@end


/// Defines the SCTE35 metadata which will be received for HLS streams.
SWIFT_CLASS("_TtC8MKPlayer20MKPScteMetadataEntry")
@interface MKPScteMetadataEntry : NSObject
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onSeek event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer12MKPSeekEvent")
@interface MKPSeekEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onSeeked event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer14MKPSeekedEvent")
@interface MKPSeekedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onSharePlayEnded event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer22MKPSharePlayEndedEvent") SWIFT_AVAILABILITY(tvos,introduced=15.0) SWIFT_AVAILABILITY(ios,introduced=15.0)
@interface MKPSharePlayEndedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onSharePlayStarted event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer24MKPSharePlayStartedEvent") SWIFT_AVAILABILITY(tvos,introduced=15.0) SWIFT_AVAILABILITY(ios,introduced=15.0)
@interface MKPSharePlayStartedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onSharePlaySuspensionEnded event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer32MKPSharePlaySuspensionEndedEvent") SWIFT_AVAILABILITY(tvos,introduced=15.0) SWIFT_AVAILABILITY(ios,introduced=15.0)
@interface MKPSharePlaySuspensionEndedEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onSharePlaySuspensionStarted event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer34MKPSharePlaySuspensionStartedEvent") SWIFT_AVAILABILITY(tvos,introduced=15.0) SWIFT_AVAILABILITY(ios,introduced=15.0)
@interface MKPSharePlaySuspensionStartedEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onSourceLoaded event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer20MKPSourceLoadedEvent")
@interface MKPSourceLoadedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onSourceUnloaded event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer22MKPSourceUnloadedEvent")
@interface MKPSourceUnloadedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onSourceWillUnload event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer24MKPSourceWillUnloadEvent")
@interface MKPSourceWillUnloadEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onStallEnded event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer18MKPStallEndedEvent")
@interface MKPStallEndedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onStallStarted event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer20MKPStallStartedEvent")
@interface MKPStallStartedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event data that will be received as part of the onSubtitleChanged event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer23MKPSubtitleChangedEvent")
@interface MKPSubtitleChangedEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the subtitle track related parameters.
SWIFT_CLASS("_TtC8MKPlayer16MKPSubtitleTrack")
@interface MKPSubtitleTrack : MKPTrack
@end


/// Defines the event data that will be received as part of the onTimeChanged event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer19MKPTimeChangedEvent")
@interface MKPTimeChangedEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onTimeShift event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer17MKPTimeShiftEvent")
@interface MKPTimeShiftEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onTimeShiftedEvent event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer19MKPTimeShiftedEvent")
@interface MKPTimeShiftedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end



/// Defines the event data that will be received as part of the onUnmuted event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer15MKPUnmutedEvent")
@interface MKPUnmutedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the event that will be received as part of the onVideoDownloadQualityChanged event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer35MKPVideoDownloadQualityChangedEvent")
@interface MKPVideoDownloadQualityChangedEvent : MKPEvent
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


/// Defines the event data that will be received as part of the onVideoSizeChanged event.
/// Please see the documentation for <a href="../Protocols/MKPPlayerEventListener.html">MKPPlayerEventListener</a> for details on different events.
SWIFT_CLASS("_TtC8MKPlayer24MKPVideoSizeChangedEvent")
@interface MKPVideoSizeChangedEvent : MKPEvent
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


/// Defines the public API of the MKPlayer. See the documentation of each single API method for further information.
/// All calls to the public player API must be done from the main thread. Calling API methods from multiple threads
/// concurrently is not guaranteed to result in consistent and stable behavior.
SWIFT_CLASS("_TtC8MKPlayer8MKPlayer")
@interface MKPlayer : MKPPlayerEventDispatcher
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end




@class PictureInPictureEnterEvent;
@class BMPPlayerView;
@class PictureInPictureEnteredEvent;
@class PictureInPictureExitEvent;
@class PictureInPictureExitedEvent;

@interface MKPlayer (SWIFT_EXTENSION(MKPlayer)) <BMPUserInterfaceListener>
/// :nodoc:
- (void)onPictureInPictureEnter:(PictureInPictureEnterEvent * _Nonnull)event view:(BMPPlayerView * _Nonnull)view;
/// :nodoc:
- (void)onPictureInPictureEntered:(PictureInPictureEnteredEvent * _Nonnull)event view:(BMPPlayerView * _Nonnull)view;
/// :nodoc:
- (void)onPictureInPictureExit:(PictureInPictureExitEvent * _Nonnull)event view:(BMPPlayerView * _Nonnull)view;
/// :nodoc:
- (void)onPictureInPictureExited:(PictureInPictureExitedEvent * _Nonnull)event view:(BMPPlayerView * _Nonnull)view;
@end




@interface MKPlayer (SWIFT_EXTENSION(MKPlayer))
/// :nodoc:
- (void)onSourceLoaded:(BMPSourceLoadedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onPlayerError:(BMPPlayerErrorEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
/// :nodoc:
- (void)onDurationChanged:(BMPDurationChangedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
- (void)onReady:(BMPReadyEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
- (void)onSourceUnloaded:(BMPSourceUnloadedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
- (void)onSourceError:(BMPSourceErrorEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
- (void)onTimeChanged:(BMPTimeChangedEvent * _Nonnull)event player:(id <BMPPlayer> _Nonnull)player;
@end



#endif
#if defined(__cplusplus)
#endif
#if __has_attribute(external_source_symbol)
# pragma clang attribute pop
#endif
#pragma clang diagnostic pop
#endif

#else
#error unsupported Swift architecture
#endif
